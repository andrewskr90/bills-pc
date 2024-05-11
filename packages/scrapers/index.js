import { 
    loginBillsPc,
    getSetsBillsPc,
    postSetsBillsPc,
    postItemsBillsPc,
    getItemsBillsPc,
    getLanguagesBillsPc,
    getPrintingsBillsPc,
    getConditionsBillsPc,
    getSkusBillsPc,
    postSkusBillsPc,
    postPricesBillsPc
} from './api/index.js'
import TCGPAPI from './api/tcgp.js'

const catalogueSync = async () => {
    // login bills pc
    const cookies = await loginBillsPc()
    // login tcgp
    const apiToken = await TCGPAPI.authenticate()

    const buildTCGPReferenceData = async () => {
        const tcgp_languages = await TCGPAPI.languages(apiToken)
        const tcgp_printings = await TCGPAPI.printings(apiToken)
        const tcgp_conditions = await TCGPAPI.conditions(apiToken)
        const bpc_languages = await getLanguagesBillsPc(cookies)  
        const bpc_printings = await getPrintingsBillsPc(cookies)  
        const bpc_conditions = await getConditionsBillsPc(cookies)  
        const referenceData = {
            tcgp: { languages: {}, printings: {}, conditions: {} },
            bpc: { languages: {}, printings: {}, conditions: {} }
        } 
        tcgp_languages.forEach(l => {
            referenceData.tcgp.languages[l.languageId] = { 
                bpcId: bpc_languages.find(bpc_l => bpc_l.tcgpId === l.languageId).id,
                ...l 
            }
        })
        tcgp_printings.forEach(p => {
            referenceData.tcgp.printings[p.printingId] = { 
                bpcId: bpc_printings.find(bpc_p => bpc_p.printing_tcgp_printing_id === p.printingId).printing_id,
                ...p
            }
        })
        tcgp_conditions.forEach(c => {
            referenceData.tcgp.conditions[c.conditionId] = { 
                bpcId: bpc_conditions.find(bpc_c => bpc_c.condition_tcgp_condition_id === c.conditionId).condition_id,
                ...c
            }
        })
        bpc_languages.forEach(x => referenceData.bpc.languages[x.id] = { ...x })
        bpc_printings.forEach(x => referenceData.bpc.printings[x.printing_id] = { ...x })
        bpc_conditions.forEach(x => referenceData.bpc.conditions[x.condition_id] = { ...x })
        return referenceData
    }
    const referenceData = await buildTCGPReferenceData()
    let moreGroups = true
    let expOffset = 0

    while (moreGroups) {
        try {
            const currentPageGroups = await TCGPAPI.groups(apiToken, expOffset)
            if (currentPageGroups.length === 0) {
                moreGroups = false
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
                const bpc_curExpansionItems = await getItemsBillsPc({ setId: bpc_curExpansion.set_v2_id }, cookies)
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
                while (moreItems) {
                    const pageNewItems = []
                    try {
                        const currentPageItems = await TCGPAPI.items(apiToken, tcgp_curGroup.groupId, itemOffset)
                        if (currentPageItems.length === 0) {
                            moreItems = false
                            continue
                        }
                        for (let i=0; i<currentPageItems.length; i++) {
                            const curItem = currentPageItems[i]
                            if (!bpc_curSetItemLookup.items[curItem.productId]) {
                                const newItem = { setId: bpc_curExpansion.set_v2_id, name: curItem.name, tcgpId: curItem.productId }
                                pageNewItems.push(newItem)
                            }
                        }
                        if (pageNewItems.length > 0) {
                            const ids = await postItemsBillsPc(pageNewItems, cookies)
                            newItemCount += pageNewItems.length
                            // update lookup with new items
                            for (let i=0; i<pageNewItems.length; i++) {
                                bpc_curSetItemLookup.items[pageNewItems[i].tcgpId] = {
                                    id: ids[i],
                                    ...pageNewItems[i]
                                }
                            }
                        }
                        let currentPageSkus = ''

                        const bpc_curSetItemPageSkuLookup = {}
                        for (let i=0; i<currentPageItems.length; i++) {
                            const itemNewSkus = []
                            const curItem = currentPageItems[i]
                            const bpcItemId = bpc_curSetItemLookup.items[curItem.productId].id
                            const bpc_itemSkus = await getSkusBillsPc({ itemId: bpcItemId }, cookies)
                            bpc_itemSkus.forEach(sku => bpc_curSetItemPageSkuLookup[sku.tcgpId] = sku)
                            const tcgp_itemSkus = await TCGPAPI.skus(apiToken, curItem.productId)
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
            }
        } catch (err) {
            if (err.status !== 404) console.log(err)
            moreGroups = false
        }
        expOffset += 10
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