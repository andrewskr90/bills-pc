import dotenv from 'dotenv'
import axios from 'axios'
import { getListingById, loginBillsPc, getSetsBillsPc, patchSetBillsPc, postSetsBillsPc, getCardsBillsPc, getProductsBillsPc } from './api/index.js'
import TCGPAPI from './api/tcgp.js'
dotenv.config()

const buildTCGPReferenceData = async () => {
    const languages = await axios(`/catalog/categories/${categoryId}/languages`, tcgpapiConfig)
    const printings = await axios(`/catalog/categories/${categoryId}/printings`, tcgpapiConfig)
    const conditions = await axios(`/catalog/categories/${categoryId}/conditions`, tcgpapiConfig)
    const referenceData = { languages: {}, printings: {}, conditions: {} }   
    languages.data.results.forEach(l => referenceData.languages[l.languageId] = { name: l.name, abbr: l.abbr })
    printings.data.results.forEach(p => referenceData.printings[p.printingId] = { name: p.name, displayOrder: p.displayOrder })
    conditions.data.results.forEach(c => referenceData.conditions[c.conditionId] = { name: c.name, displayOrder: c.displayOrder, abbr: c.abbreviation })
    return referenceData
}

const main = async () => {
    // login bills pc
    const cookies = await loginBillsPc()
    // login tcgp
    const apiToken = await TCGPAPI.authenticate()
    let moreExpansions = true
    let expOffset = 0
    while (moreExpansions) {
        const currentPageExpansions = await TCGPAPI.expansions(apiToken, expOffset)
        if (currentPageExpansions.length === 0) moreExpansions = false
        for (let i=0; i<currentPageExpansions.length; i++) {
            let bpc_curExpansion = undefined
            const tcgp_curExpansion = currentPageExpansions[i]
            const bpcExpansionsByGroupId = await getSetsBillsPc(cookies, { set_v2_tcgplayer_set_id: tcgp_curExpansion.groupId })
            // if there are no bpc exp with that groupId
            if (bpcExpansionsByGroupId.length === 0) {
                const bpcExpansionsByName = await getSetsBillsPc(cookies, { set_v2_name: tcgp_curExpansion.name })
                // if there are no bpc exp with that name
                if (bpcExpansionsByName.length === 0) {
                    // create the new set
                    const newSet = { 
                        set_v2_name: tcgp_curExpansion.name, 
                        set_v2_tcgplayer_set_id: tcgp_curExpansion.groupId 
                    }
                    const postedSets = await postSetsBillsPc(cookies, [newSet])
                    bpc_curExpansion = {
                        set_v2_id: postedSets[0].set_v2_id,
                        ...newSet
                    }
                    console.log('new set added: ', newSet.set_v2_name)
                } else {
                    // update bpc set with tcgp groupId
                    bpc_curExpansion = bpcExpansionsByName[0]
                    await patchSetBillsPc(cookies, bpc_curExpansion.set_v2_id, { set_v2_tcgplayer_set_id: tcgp_curExpansion.groupId })
                }
            } else {
                bpc_curExpansion = bpcExpansionsByGroupId[0]
            }
            const bpc_curCards = await getCardsBillsPc({ card_v2_set_id: bpc_curExpansion.set_v2_id }, cookies)
            const bpc_curProducts = await getProductsBillsPc({ product_set_id: bpc_curExpansion.set_v2_id }, cookies)
            const bpc_item_lookup = {}
            bpc_curCards.forEach(card => bpc_item_lookup[card.card_v2_tcgplayer_product_id] = card)
            bpc_curProducts.forEach(product => bpc_item_lookup[product.product_tcgplayer_product_id] = product)
            // create sku string to concatinate later
            let skus = ''
            let moreItems = true
            let itemOffset = 0
            while (moreItems) {
                const currentPageItems = await TCGPAPI.items(apiToken, tcgp_curExpansion.groupId, expOffset)
                if (currentPageItems.length === 0) moreItems = false
                for (let i=0; i<currentPageItems.length; i++) {


                    const tcgp_curItem = currentPageItems[i]
                    console.log(tcgp_curItem)
                    let bpc_curItem = bpc_item_lookup[tcgp_curItem.productId]
                    if (bpc_curItem) {
                        // check if item exists in bpc under wrong set
                        
                        // const bpcCardsByTCGPId = await getCardsBillsPc({ card_v2_tcgplayer_product_id: tcgp_curItem.productId }, cookies)
                        // if (bpcCardsByTCGPId.length !== 0) {
                        //     // console.log(bpcCardsByTCGPId)
                        // } else {
                        //     const bpcProductsByTCGPId = await getProductsBillsPc({ product_tcgplayer_product_id: tcgp_curItem.productId }, cookies)
                        //     // console.log(bpcProductsByTCGPId)
                        // }
                        // // if there are no bpc exp with that name
                        // if (bpcExpansionsByName.length === 0) {
                        //     // create the new set
                        //     const newSet = { 
                        //         set_v2_name: tcgp_curItem.name, 
                        //         set_v2_tcgplayer_set_id: tcgp_curItem.groupId 
                        //     }
                        //     const postedSets = await postSetsBillsPc(cookies, [newSet])
                        //     bpc_curItem = {
                        //         set_v2_id: postedSets[0].set_v2_id,
                        //         ...newSet
                        //     }
                        //     console.log('new set added: ', newSet.set_v2_name)
                        // } else {
                        //     bpc_curItem = bpcExpansionsByName[0]
                        // }
                    }
                    // console.log(bpc_curItem)
                }
                // for each item in tcgp set
                    // ** sync item information **
                    // find item by tcgp item id
                    // if tcgp item id is not present in bpc
                        // add item into bpc
                    // if item info in bpc doesnt match tcgp info
                        // update bpc info
                    // get skus from tcgp
                    // for each item sku
                        // if sku is not present in bpc
                            // add sku into bpc
                        // if sku details not correct in bpc
                            // update bpc sku
                        // add sku id to sku string
            }
            // if length of sku string is too long
                // get tcgp prices with multiple api calls
            // get tcgp prices from sku string
            // add prices into bpc
        }
        expOffset += 10
    }







    // const cookies = await loginBillsPc()
    // const listingId = 'a817bf7b-b261-4415-87ae-7ef726ec560e'
    // const listing = await getListingById(cookies, listingId)
    // const items = listing.data[0].lot.items
    // const categoriesParams = { limit: 3, sortOrder: 'categoryId' }
    // const categories = await axios.get('/catalog/categories', { ...tcgpapiConfig, params: categoriesParams })

    // const tcgpReferenceData = await buildTCGPReferenceData()
    // const groupsRes = await axios.get(`/catalog/categories/${categoryId}/groups?offset=20`, tcgpapiConfig)
    // const groups = groupsRes.data.results
    // const profiles = {
    //     '10': 'Normal',
    //     '11': 'Holofoil',
    //     '77': 'Reverse Holofoil',
    //     '10,77': 'Normal,Reverse Holofoil',
    //     '10,11,77': 'Normal,Holofoil,Reverse Holofoil',
    //     '11,77': 'Holofoil,Reverse Holofoil',
    //     '10,11': 'Normal,Holofoil'
    // }
    // for (let i=0; i<groups.length; i++) {
    //     const group = groups[i]
    //     console.log('Group: ', group.name)
    //     let offset = 0
    //     let previousPageFull = true
    //     while (previousPageFull) {
    //         try {
    //             const productsRes = await axios.get(`/catalog/products?groupId=${group.groupId}&offset=${offset}`, tcgpapiConfig)
    //             const products = productsRes.data.results
    //             // let commaSeperatedSKUs = ''
    //             for (let j=0; j<products.length; j++) {
    //                 const { productId } = products[j]
    //                 const skusRes = await axios.get(`/catalog/products/${productId}/skus`, tcgpapiConfig)
    //                 const skus = skusRes.data.results
    //                 const printingArray = []
    //                 for (let k=0; k<skus.length; k++) {
    //                     const sku = skus[k]
    //                     if (!printingArray.includes(sku.printingId)) printingArray.push(sku.printingId)
    //                 }
    //                 const printingProfile = printingArray.sort((a,b) => a-b).join(',')
    //                 if (!profiles[printingProfile]) profiles[printingProfile] = printingArray.map(id => tcgpReferenceData.printings[id].name).join(',')
    //                 // if (j<products.length-1) commaSeperatedSKUs += ','
    //             }
    //             // const getMarketPricesBySKUs = await axios.get(`/pricing/sku/${commaSeperatedSKUs}`, tcgpapiConfig)

    //             offset += 10
    //         } catch (err) {
    //             console.log(err.response.data.errors)
    //             previousPageFull = false
    //         }
    //     }
    // }
    // console.log(profiles)
}
main()
