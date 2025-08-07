import { 
    loginBillsPc,
    getSetsBillsPc,
    postSetsBillsPc,
    postItemsBillsPc,
    getSkusBillsPc,
    postSkusBillsPc,
    postPricesBillsPc,
    patchItemByFilterBillsPc,
    getAllItemsInExpansionBillsPc,
    getItemsBillsPc
} from './api/index.js'
import TCGPAPI from './api/tcgp.js'
import dotenv from 'dotenv'
import { buildTCGPReferenceData, intArraysMatch } from './utils/index.js'
dotenv.config()

const processUnexpectedItems = async (unexpectedItems, cookies) => {

    const processNewItems = async (items) => {
        const ids = await postItemsBillsPc(items, cookies)
        const newItemsWithIds = items.map((item, idx) => {
            const id = ids[idx]
            return { id, ...item }
        })
        return newItemsWithIds
    }

    try {
        const newItems = await processNewItems(unexpectedItems, cookies)
        return { newItems, updatedItems: [] }
    } catch (err) {
        const { status } = err.response
        const DUPLICATE = 422
        if (status === DUPLICATE) {
            if (err.response.data.message.includes('Item.tcgpId')) {
                const updatedItems = []
                // narrow down stale items within page's new or updated items
                const newOrStaleTcgpIds = unexpectedItems
                    .map(newItem => newItem.tcgpId)
                    .join(',')
                const bpcExistingItemsRes = await getItemsBillsPc(
                    { tcgpIds: newOrStaleTcgpIds }, 
                    cookies
                )
                const bpcExistingItems = bpcExistingItemsRes.items
                const formattedItemsToPatch = bpcExistingItems.map(existingItem => {
                    const updatedValues = unexpectedItems.find(updatedItem => {
                        return updatedItem.tcgpId === existingItem.tcgpId
                    })
                    return { id: existingItem.id, tcgpId: existingItem.tcgpId, setId: updatedValues.setId, name: updatedValues.name }
                })
                const newItemsToCreate = unexpectedItems.filter(item => {
                    return !bpcExistingItems.map(item => item.tcgpId).includes(item.tcgpId)
                })
                for (let i=0; i<formattedItemsToPatch.length; i++) {
                    const formattedItemToPatch = formattedItemsToPatch[i]
                    try {
                        await patchItemByFilterBillsPc(
                            { tcgpId: formattedItemToPatch.tcgpId }, 
                            formattedItemToPatch, 
                            cookies
                        )
                        updatedItems.push(formattedItemToPatch)
                    } catch (err) {
                        throw new Error(`unable to update item values with tcgpId ${formattedItemToPatch.tcgpId}`)
                    }
                }
                const newItems = await processNewItems(newItemsToCreate)
                return { newItems, updatedItems }
            }
        }
        throw new Error(`unable to create new or update existing items. tcgpIds: ${unexpectedItems.map(item => item.tcgpId).join(',')}`)
    }
}

const tcgpCategoryIds = [
    3, // english pokemon
    50, // storage albums
    85 // japanese pokemon
]

const catalogueSync = async () => {
    // login bills pc
    const cookies = await loginBillsPc()
    // login tcgp
    const apiToken = await TCGPAPI.authenticate()


    for (let i=0; i<tcgpCategoryIds.length; i++) {
        const tcgpCategoryId = tcgpCategoryIds[i]
        const referenceData = await buildTCGPReferenceData(cookies, apiToken, tcgpCategoryId)
        let moreGroups = true
        let expOffset = 0
        while (moreGroups) {
            try {
                const fetchedPageGroups = await TCGPAPI.groups(apiToken, expOffset, tcgpCategoryId)
                if (fetchedPageGroups.length === 0) {
                    moreGroups = false
                }
                let currentPageGroups = fetchedPageGroups
                if (tcgpCategoryId === 50) {
                    currentPageGroups = currentPageGroups.filter(group => group.name === 'Pokemon International Storage Albums')
                }
                for (let i=0; i<currentPageGroups.length; i++) {
                    const tcgp_curGroup = currentPageGroups[i]
                    console.log(`Group name: ${tcgp_curGroup.name}`)
                    let bpc_curExpansion = undefined
                    const bpcExpansionsByGroupId = await getSetsBillsPc(cookies, { set_v2_tcgplayer_set_id: tcgp_curGroup.groupId })
                    // if there are no bpc set with that groupId
                    if (bpcExpansionsByGroupId.length === 0) {
                        // create the new set
                        const newSet = { 
                            set_v2_name: tcgp_curGroup.name, 
                            set_v2_tcgplayer_set_id: tcgp_curGroup.groupId 
                        }
                        const postedSets = await postSetsBillsPc(cookies, [newSet])
                        console.log('Group has been added as set to bpc')
                        bpc_curExpansion = {
                            set_v2_id: postedSets[0].set_v2_id,
                            ...newSet
                        }
                    } else {
                        bpc_curExpansion = bpcExpansionsByGroupId[0]
                    }
                    const bpc_curExpansionItems = await getAllItemsInExpansionBillsPc(bpc_curExpansion.set_v2_id, cookies)
                    const bpc_curSetItemLookup = {
                        items: {},
                        skus: {}
                    }
                    bpc_curExpansionItems.forEach(item => bpc_curSetItemLookup.items[item.tcgpId] = item)

                    let moreItems = true
                    let itemOffset = 0
                    let newItemCount = 0
                    let newSkuCount = 0
                    let newPriceCount = 0
                    let updatedItemCount = 0

                    while (moreItems) {
                        const unexpectedItems = []
                        try {
                            const currentPageItems = await TCGPAPI.items(apiToken, tcgp_curGroup.groupId, itemOffset)
                            if (currentPageItems.length === 0) {
                                moreItems = false
                                continue
                            }
                            const formattedPageItems = currentPageItems.map(item => { 
                                return {
                                    name: item.name, 
                                    setId: bpc_curExpansion.set_v2_id, 
                                    tcgpId: item.productId
                                } 
                            })
                            for (let i=0; i<formattedPageItems.length; i++) {
                                const curItem = formattedPageItems[i]
                                if (!bpc_curSetItemLookup.items[curItem.tcgpId]) {
                                    unexpectedItems.push(curItem)
                                }
                            }
                            if (unexpectedItems.length > 0) {
                                const { newItems, updatedItems } = await processUnexpectedItems(unexpectedItems, cookies)
                                newItemCount += newItems.length
                                updatedItemCount += updatedItems.length
                                // update lookup with new and updated items
                                for (let i=0; i<newItems.length; i++) {
                                    bpc_curSetItemLookup.items[newItems[i].tcgpId] = newItems[i]
                                }
                                for (let i=0; i<updatedItems.length; i++) {
                                    bpc_curSetItemLookup.items[updatedItems[i].tcgpId] = updatedItems[i]
                                }
                            }
                            let currentPageSkus = ''

                            const bpc_curSetItemPageSkuLookup = {}
                            for (let i=0; i<formattedPageItems.length; i++) {
                                const itemNewSkus = []
                                const curItem = formattedPageItems[i]
                                const bpcItem = bpc_curSetItemLookup.items[curItem.tcgpId]
                                const bpcItemId = bpcItem.id
                                const bpc_itemSkus = await getSkusBillsPc({ itemId: bpcItemId }, cookies)
                                bpc_itemSkus.forEach(sku => bpc_curSetItemPageSkuLookup[sku.tcgpId] = sku)
                                const justTCGPSkuFromBpc = bpc_itemSkus.map(skuObj => skuObj.tcgpId)
                                const tcgp_itemSkus = await TCGPAPI.skus(apiToken, curItem.tcgpId)
                                const justTCGPSkuFromTCGP = tcgp_itemSkus.map(skuObj => skuObj.skuId)
                                if (!intArraysMatch(justTCGPSkuFromBpc, justTCGPSkuFromTCGP)) {
                                    console.log(`${bpcItem.name} not synced with tcgp. id = ${bpcItem.id}`)
                                    console.log(`bpc skus: ${'[' + justTCGPSkuFromBpc.join(',') + ']'}`)
                                    console.log(`tcgp skus: ${'[' + justTCGPSkuFromTCGP.join(',') + ']'}`)
                                }
                                for (let j=0; j<tcgp_itemSkus.length; j++) {
                                    const tcgpSku = tcgp_itemSkus[j]
                                    currentPageSkus += `${tcgpSku.skuId}`
                                    if (i === currentPageItems.length-1 && j === tcgp_itemSkus.length-1) {
                                    } else {
                                        currentPageSkus += ','
                                    }
                                    if (!bpc_curSetItemPageSkuLookup[tcgpSku.skuId]) {
                                        const bpcConditionId = referenceData.tcgp.conditions[tcgpSku.conditionId].bpcId
                                        const bpcPrintingId = referenceData.tcgp.printings[tcgpSku.printingId].bpcId
                                        const bpcLanguageId = referenceData.tcgp.languages[tcgpSku.languageId].bpcId
                                        const newSku = {
                                            tcgpId: tcgpSku.skuId,
                                            itemId: bpcItemId,
                                            conditionId: bpcConditionId,
                                            printingId: bpcPrintingId,
                                            languageId: bpcLanguageId
                                        }
                                        itemNewSkus.push(newSku)
                                    }
                                }
                                if (itemNewSkus.length > 0) {
                                    const ids = await postSkusBillsPc(itemNewSkus, cookies)
                                    newSkuCount += itemNewSkus.length

                                    // update lookup with new skus
                                    for (let i=0; i<itemNewSkus.length; i++) {
                                        bpc_curSetItemPageSkuLookup[itemNewSkus[i].tcgpId] = { id: ids[i], ...itemNewSkus[i]}
                                    }
                                }
                            }
                            const tcgpPrices = await TCGPAPI.pricesBySkus(apiToken, currentPageSkus)
                            const nonZeroPrices = tcgpPrices.filter(price => price.marketPrice)
                            const formattedMarketPrices = nonZeroPrices.map(price => ({ skuId: bpc_curSetItemPageSkuLookup[price.skuId].id, price: price.marketPrice }))
                            if (formattedMarketPrices.length > 0) {
                                await postPricesBillsPc(formattedMarketPrices, cookies)
                                newPriceCount += formattedMarketPrices.length
                            }
                        } catch (err) {
                            if (err.status !== 404) console.log(err)
                            moreItems = false
                        }
                        itemOffset += 10
                    }
                    if (newItemCount > 0) console.log(`Added ${newItemCount} new items`)
                    if (newSkuCount > 0) console.log(`Added ${newSkuCount} new skus`)
                    if (newPriceCount > 0) console.log(`Added ${newPriceCount} new market prices`)
                    if (updatedItemCount > 0) console.log(`Updated ${updatedItemCount} items`)
                }
            } catch (err) {
                if (err.status !== 404) console.log(err)
                moreGroups = false
            }
            expOffset += 10
        }
    }
}

const startScraper = async () => {
    const now = new Date()
    const midnight = new Date()
    midnight.setDate(midnight.getDate()+1)
    midnight.setUTCHours(0,0,0,0)
    const timeUntilMidnight = midnight-now
    console.log('------------------------------------------------------------------------------------------------------------')
    console.log('------------------------------------------------------------------------------------------------------------')
    console.log('------------------------------------------------------------------------------------------------------------')
    console.log('------------------------------------------------------------------------------------------------------------')
    console.log('------------------------------------------It Is Midnight UTC------------------------------------------------')
    console.log(`---------------------------------${new Date()}--------------------------------`)
    console.log('-------------------------------------Starting Market Price Scrape-------------------------------------------')
    console.log('------------------------------------------------------------------------------------------------------------')
    console.log('------------------------------------------------------------------------------------------------------------')
    console.log('------------------------------------------------------------------------------------------------------------')
    console.log('------------------------------------------------------------------------------------------------------------')
    
   await catalogueSync()

    console.log('------------------------------------------------------------------------------------------------------------')
    console.log('------------------------------------------------------------------------------------------------------------')
    console.log('------------------------------------------------------------------------------------------------------------')
    console.log('------------------------------------------------------------------------------------------------------------')
    console.log('------------------------------------------------------------------------------------------------------------')
    console.log('-------------------------------------Market Price Scrape Finished-------------------------------------------')
    console.log('------------------------------------------------------------------------------------------------------------')
    console.log('------------------------------------------------------------------------------------------------------------')
    console.log('------------------------------------------------------------------------------------------------------------')
    console.log('------------------------------------------------------------------------------------------------------------')
    console.log('------------------------------------------------------------------------------------------------------------')

    await setTimeout(async () => {
        await startScraper()
    }, timeUntilMidnight)
}

try {
    await startScraper()
} catch (err) {
    console.log(err)
    throw new Error
}