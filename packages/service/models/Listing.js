const { executeQueries } = require('../db/index')
const { fetchOrCreateLabelIds } = require('../utils/bulk-splits')
const { objectsToInsert } = require("../utils/queryFormatters")
const { v4: uuidV4 } = require('uuid')

const getWatching = async (watcherId) => {
    const timeWithBackticks = '`time`'
    const descriptionWithBackticks = '`description`'
    const query = `
        SELECT 
            V3_Listing.id,
            sellers.user_id as sellerId,
            sellers.user_name as sellerName,
            watchers.user_id as watcherId,
            V3_CollectedItem.id as collectedItemId,
            V3_BulkSplit.id as bulkSplitId,
            V3_Lot.id as lotId,
            V3_Listing.${timeWithBackticks} as listingTime,
            GROUP_CONCAT('[',UNIX_TIMESTAMP(V3_ListingPrice.time), ',', V3_ListingPrice.price,']' ORDER BY V3_ListingPrice.time DESC SEPARATOR ',') as listingPrices,
            V3_Listing.${descriptionWithBackticks} as listingDescription,
            V3_Gift.id as giftId,
            V3_Watching.id as watchingId
        FROM V3_Listing
        LEFT JOIN V3_ListingPrice
            on V3_ListingPrice.listingId = V3_Listing.id
        LEFT JOIN V3_Lot 
            on V3_Lot.id = V3_Listing.lotId
        LEFT JOIN V3_CollectedItem 
            on V3_CollectedItem.id = V3_Listing.collectedItemId
        LEFT JOIN Item 
            on Item.id = V3_CollectedItem.itemId
        LEFT JOIN V3_BulkSplit
            on V3_BulkSplit.id = V3_Listing.bulkSplitId
        LEFT JOIN V3_Gift
            ON V3_Gift.collectedItemId = V3_CollectedItem.id
            OR V3_Gift.bulkSplitId = V3_BulkSplit.id
            OR V3_Gift.lotId = V3_Lot.id
        LEFT JOIN users as sellers
            on sellers.user_id = V3_Gift.recipientId
        LEFT JOIN V3_Watching
            on V3_Watching.listingId = V3_Listing.id
        LEFT JOIN users as watchers
            on watchers.user_id = V3_Watching.watcherId
        WHERE V3_Watching.watcherId = '${watcherId}' AND V3_Listing.saleId IS NULL
        Group by V3_Listing.id;
    `
    const req = { queryQueue: [query] }
    const res = {}
    let watchedListings
    await executeQueries(req, res, (err) => {
        if (err) throw err
        watchedListings = req.results
    })
    return watchedListings
}

const getListingById = async (listingId) => {
    const timeWithBackticks = '`time`'
    const descriptionWithBackticks = '`description`'
    const query = `
        SELECT 
            V3_Listing.id,
            sellers.user_id as sellerId,
            sellers.user_name as sellerName,
            sellers.proxyCreatorId,
            V3_CollectedItem.id as collectedItemId,
            V3_CollectedItem.printingId as printingId,
            V3_Appraisal.conditionId as conditionId,
            SKU.id as skuId,
            V3_BulkSplit.id as bulkSplitId,
            V3_Listing.${timeWithBackticks} as listingTime,
            GROUP_CONCAT('[',UNIX_TIMESTAMP(V3_ListingPrice.time), ',', V3_ListingPrice.price,']' ORDER BY V3_ListingPrice.time DESC SEPARATOR ',') as listingPrices,
            V3_Listing.${descriptionWithBackticks},
            Item.id as itemId,
            Item.name as name,
            Item.tcgpId as tcgpId,
            V3_Lot.id as lotId,
            sets_v2.set_v2_id as setId,
            sets_v2.set_v2_name as setName
        FROM V3_Listing
        LEFT JOIN V3_ListingPrice
            on V3_ListingPrice.listingId = V3_Listing.id
        LEFT JOIN V3_Lot 
            on V3_Lot.id = V3_Listing.lotId
        LEFT JOIN V3_CollectedItem 
            on V3_CollectedItem.id = V3_Listing.collectedItemId
        LEFT JOIN V3_Appraisal
            on V3_Appraisal.collectedItemId = V3_CollectedItem.id
        LEFT JOIN Item 
            on Item.id = V3_CollectedItem.itemId
        LEFT JOIN SKU
            on SKU.itemId = Item.id
            AND SKU.printingId = V3_CollectedItem.printingId
            AND SKU.conditionId = V3_Appraisal.conditionId
        LEFT JOIN sets_v2
            on Item.setId = sets_v2.set_v2_id
        LEFT JOIN V3_BulkSplit
            ON V3_BulkSplit.id = V3_Listing.bulkSplitId
        LEFT JOIN V3_Gift
            ON V3_Gift.collectedItemId = V3_CollectedItem.id
            OR V3_Gift.bulkSplitId = V3_BulkSplit.id
            OR V3_Gift.lotId = V3_Lot.id
        LEFT JOIN users as sellers
            on sellers.user_id = V3_Gift.recipientId
        WHERE V3_Listing.id = '${listingId}'
        Group by V3_CollectedItem.id;
    `
    const req = { queryQueue: [query] }
    const res = {}
    let listing
    await executeQueries(req, res, (err) => {
        if (err) throw err
        listing = req.results
    })
    return listing[0]
}

const formatListingWithLot = (listing) => {
    const listingId = uuidV4();
    const { date, price, description } = listing
    // create lot
    const lotId = uuidV4();
    const formattedLot = {
        id: lotId,
    }
    // create lot items
    const lotItemsToInsert = []
    listing.cards.forEach(card => {
        const { collected_card_id } = card
        const formattedLotCard = {
            id: uuidV4(),
            lotId,
            collected_card_id,
            collected_product_id: null,
            bulk_split_id: null
        }
        lotItemsToInsert.push(formattedLotCard)
    })
    listing.products.forEach(product => {
        const { collected_product_id } = product
        const formattedLotProduct = {
            id: uuidV4(),
            lotId,
            collected_card_id: null,
            collected_product_id,
            bulk_split_id: null
        }
        lotItemsToInsert.push(formattedLotProduct)
    })        
    listing.bulkSplits.forEach(bulkSplit => {
        const { bulk_split_id } = bulkSplit
        const formattedLotBulkSplit = {
            id: uuidV4(),
            lotId,
            collected_card_id: null,
            collected_product_id: null,
            bulk_split_id
        }
        lotItemsToInsert.push(formattedLotBulkSplit)
    })
    // create listing
    const formattedListing = {
        id: listingId,
        date,
        price,
        description,
        lotId: lotId,
        collected_card_id: null,
        collected_product_id: null,
        bulk_split_id: null,
        saleId: null
    }
    return { formattedLot, lotItemsToInsert, formattedListing }
} 

const formatListing = (listing) => {
    const listingId = uuidV4();
    const { date, price, description } = listing
    // create listing
    const formattedListing = {
        id: listingId,
        date,
        price,
        description,
        lotId: null,
        collected_card_id: null,
        collected_product_id: null,
        bulk_split_id: null,
        saleId: null
    }
    if (listing.cards.length === 1) {
        const { collected_card_id } = listing.cards[0]
        formattedListing.collected_card_id = collected_card_id
    } else if (listing.products.length === 1) {
        const { collected_product_id } = listing.products[0]
        formattedListing.collected_product_id = collected_product_id
    } else if (listing.bulkSplits.length === 1) {
        const { bulk_split_id } = listing.bulkSplits[0]
        formattedListing.bulk_split_id = bulk_split_id
    }
    return formattedListing
}

const convertLocalToUTC = (local) => {
    const utcDate = new Date(local)
    return`${
        utcDate.getUTCFullYear()}-${
        (utcDate.getUTCMonth() + 1).toString().padStart(2, '0')}-${
        utcDate.getUTCDate().toString().padStart(2, '0')}T${
        utcDate.getUTCHours().toString().padStart(2, '0')}:${
        utcDate.getUTCMinutes().toString().padStart(2, '0')}:${
        utcDate.getUTCSeconds().toString().padStart(2, '0')
    }`
}

const createExternal = async (listing, watcherId) => {
    const queryQueue = []
    if ((listing.items.length + listing.bulkSplits.length) === 0) {
        throw new Error("No item(s) specified within listing.")
    }
    const now = new Date()
    // create collected items
    if (listing.items.length > 0) {
        const collectedItemsToInsert = []
        const appraisalsToInsert = []
        const collectedItemNotesToInsert = []
        listing.items.forEach((item, idx) => {
            const collectedItemId = uuidV4()
            const formattedItem = {
                id: collectedItemId,
                itemId: item.id,
                printingId: item.printing
            }
            const appraisalId = uuidV4()
            const formattedAppraisal = {
                id: appraisalId,
                collectedItemId,
                conditionId: item.condition,
                appraiserId: listing.sellerId,
                time: listing.time
            }
            if (item.note) {
                const itemNoteId = uuidV4()
                const formattedCollectedItemNote = {
                    id: itemNoteId, 
                    collectedItemId, 
                    takerId: watcherId,
                    note: item.note,
                    time: convertLocalToUTC(now)
                }

                collectedItemNotesToInsert.push(formattedCollectedItemNote)
            }
            collectedItemsToInsert.push(formattedItem)
            appraisalsToInsert.push(formattedAppraisal)
            listing.items[idx] = { ...item, collectedItemId }
        })
        queryQueue.push(`${objectsToInsert(collectedItemsToInsert, 'V3_CollectedItem')};`)
        queryQueue.push(`${objectsToInsert(appraisalsToInsert, 'V3_Appraisal')};`)        
        if (collectedItemNotesToInsert.length > 0) {
            queryQueue.push(`${objectsToInsert(collectedItemNotesToInsert, 'V3_CollectedItemNote')};`)
        }
    }
    if (listing.bulkSplits.length > 0) {
        // bulk splits
        const bulkSplitsToInsert = []
        const bulkSplitLabelsToInsert = []
        const bulkSplitNotesToInsert = []
        for (let i=0; i<listing.bulkSplits.length; i++) {
            const bulkSplitId = uuidV4()
            const formattedBulkSplit = {
                id: bulkSplitId,
                count: listing.bulkSplits[i].count,
                estimate: listing.bulkSplits[i].estimate
            }
            if (listing.bulkSplits[i].note) {
                const bulkSplitNoteId = uuidV4()
                const formattedBulkSplitNote = {
                    id: bulkSplitNoteId, 
                    bulkSplitId, 
                    takerId: watcherId,
                    note: listing.bulkSplits[i].note,
                    time: convertLocalToUTC(now)
                }
                bulkSplitNotesToInsert.push(formattedBulkSplitNote)
            }             
            listing.bulkSplits[i] = { ...listing.bulkSplits[i], bulkSplitId }
            const bulkSplitLabels = await fetchOrCreateLabelIds(listing.bulkSplits[i])
            bulkSplitsToInsert.push(formattedBulkSplit)
            bulkSplitLabelsToInsert.push(...bulkSplitLabels)
        }
        queryQueue.push(`${objectsToInsert(bulkSplitsToInsert, 'V3_BulkSplit')};`)  
        if (bulkSplitLabelsToInsert.length > 0) {
            queryQueue.push(`${objectsToInsert(bulkSplitLabelsToInsert, 'V3_BulkSplitLabel')};`)  
        }
        if (bulkSplitNotesToInsert.length > 0) {
            queryQueue.push(`${objectsToInsert(bulkSplitNotesToInsert, 'V3_BulkSplitNote')};`)  
        }
    }
    let collectedItemId = undefined
    let bulkSplitId = undefined
    let lotId = undefined
    // if lot
    if ((listing.items.length + listing.bulkSplits.length) > 1) {
        const formattedLotInsertsToInsert = []
        // create V3_Lot
        lotId = uuidV4();
        const formattedLot = {
            id: lotId
        }
        // create V3_LotEdit
        const lotEditId = uuidV4()
        const formattedLotEdit = {
            id: lotEditId,
            lotId,
            time: listing.time
        }
        // create V3_LotInsert
        listing.items.forEach((item, index) => {
            const { collectedItemId } = item
            const lotInsertId = uuidV4()
            const formattedLotInsert = {
                id: lotInsertId,
                lotEditId,
                collectedItemId,
                index
            }
            formattedLotInsertsToInsert.push(formattedLotInsert)
        })
        listing.bulkSplits.forEach((bulkSplit, idx) => {
            const { bulkSplitId } = bulkSplit
            const lotInsertId = uuidV4()
            const index = idx + listing.items.length
            const formattedLotInsert = {
                id: lotInsertId,
                lotEditId,
                bulkSplitId,
                index
            }
            formattedLotInsertsToInsert.push(formattedLotInsert)
        })
        queryQueue.push(`${objectsToInsert([formattedLot], 'V3_Lot')};`)  
        queryQueue.push(`${objectsToInsert([formattedLotEdit], 'V3_LotEdit')};`)  
        queryQueue.push(`${objectsToInsert(formattedLotInsertsToInsert, 'V3_LotInsert')};`)  
    } else if (listing.items.length > 0) {
        collectedItemId = listing.items[0].collectedItemId
    } else if (listing.bulkSplits.length > 0) {
        bulkSplitId = listing.bulkSplits[0].bulkSplitId
    }

    // create gift
    const giftId = uuidV4();
    const formattedGift = {
        id: giftId,
        recipientId: listing.sellerId,
        collectedItemId,
        bulkSplitId,
        lotId,
        time: listing.time
    }
    queryQueue.push(`${objectsToInsert([formattedGift], 'V3_Gift')};`)
    // create listing
    const listingId = uuidV4()
    const formattedListing = {
        id: listingId,
        collectedItemId,
        bulkSplitId,
        lotId,
        description: listing.description,
        saleId: undefined,
        time: listing.time
    }
    queryQueue.push(`${objectsToInsert([formattedListing], 'V3_Listing')};`)
    // create ListingPrice
    const listingPriceId = uuidV4()
    const formattedListingPrice = {
        id: listingPriceId,
        listingId,
        price: listing.price,
        time: listing.time
    }
    queryQueue.push(`${objectsToInsert([formattedListingPrice], 'V3_ListingPrice')};`)
    // create Watching
    const watchingId = uuidV4()
    const formattedWatching = { 
        id: watchingId, 
        listingId, 
        watcherId
    }
    queryQueue.push(`${objectsToInsert([formattedWatching], 'V3_Watching')};`)
    const req = { queryQueue }
    const res = {}
    await executeQueries(req, res, (err) => {
        if (err) throw err
    })
    return listingId
}

const convertSaleItemsToListings = async (listing) => {
    const queryQueue = []
    let listingId
    // create gift
    const gift_id = uuidV4();
    const formattedGift = {
        gift_id,
        gift_receiver_id: listing.sellerId
    }
    queryQueue.push(`${objectsToInsert([formattedGift], 'gifts')};`)
    // create gift cards
    const giftCardsToInsert = []
    listing.cards.forEach(card => {
        const { collected_card_id } = card
        const formattedGiftCard = {
            gift_card_id: uuidV4(),
            gift_card_gift_id: gift_id,
            gift_card_collected_card_id: collected_card_id,
        }
        giftCardsToInsert.push(formattedGiftCard)
    })
    // create gift products
    const giftProductsToInsert = []
    listing.products.forEach(product => {
        const { collected_product_id } = product
        const formattedGiftProduct = {
            gift_product_id: uuidV4(),
            gift_product_gift_id: gift_id,
            gift_product_collected_product_id: collected_product_id,
        }
        giftProductsToInsert.push(formattedGiftProduct)
    })    
    // create gift splits
    const giftSplitsToInsert = []
    listing.bulkSplits.forEach(bulkSplit => {
        const { bulk_split_id } = bulkSplit
        const formattedGiftBulkSplit = {
            gift_bulk_split_id: uuidV4(),
            gift_bulk_split_gift_id: gift_id,
            gift_bulk_split_bulk_split_id: bulk_split_id,
        }
        giftSplitsToInsert.push(formattedGiftBulkSplit)
    })
    if (giftCardsToInsert.length > 0) {
        queryQueue.push(`${objectsToInsert(giftCardsToInsert, 'gift_cards')};`)
    }
    if (giftProductsToInsert.length > 0) {
        queryQueue.push(`${objectsToInsert(giftProductsToInsert, 'gift_products')};`)
    }
    if (giftSplitsToInsert.length > 0) {
        queryQueue.push(`${objectsToInsert(giftSplitsToInsert, 'gift_bulk_splits')};`)
    }
    if ((listing.cards.length + listing.products.length + listing.bulkSplits.length) > 1) {
        const { formattedLot, lotItemsToInsert, formattedListing } = formatListingWithLot(listing)
        formattedListing.saleId = listing.saleId
        queryQueue.push(`${objectsToInsert([formattedLot], 'Lot')};`)
        queryQueue.push(`${objectsToInsert(lotItemsToInsert, 'LotItem')};`)
        queryQueue.push(`${objectsToInsert([formattedListing], 'Listing')};`)
        listingId = formattedListing.id
    } else {
        const formattedListing = formatListing(listing)
        formattedListing.saleId = listing.saleId
        queryQueue.push(`${objectsToInsert([formattedListing], 'Listing')};`)
        listingId = formattedListing.id
    }
    const req = { queryQueue }
    const res = {}
    await executeQueries(req, res, (err) => {
        if (err) throw err
    })
    return listingId
}

const createPrice = async ({ listingId, price }) => {
    const queryQueue = []
    const now = new Date()
    const id = uuidV4()
    const listingPriceToInsert = {
        id,
        listingId,
        price,
        time: convertLocalToUTC(now)
    }
    queryQueue.push(`${objectsToInsert([listingPriceToInsert], 'V3_ListingPrice')};`)
    const req = { queryQueue }
    const res = {}
    await executeQueries(req, res, (err) => {
        if (err) throw err
    })
    return id
}

module.exports = { getWatching, createExternal, convertSaleItemsToListings, getListingById, createPrice }
