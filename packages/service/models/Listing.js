const { executeQueries } = require('../db/index')
const { fetchOrCreateLabelIds } = require('../utils/bulk-splits')
const { objectsToInsert } = require("../utils/queryFormatters")
const { v4: uuidV4 } = require('uuid')
const Transaction = require('./Transaction')
const Gift = require('./Gift')
const LotEdit = require('../models/LotEdit')
const LotInsert = require('../models/LotInsert')
const Import = require('../models/Import')
const Sale = require('../models/Sale')
const { adjustISOHours } = require('../utils/date')

const previousTransaction = async (subject) => {

    const timeCutoff = subject.timeCutoff

    if (subject.collectedItemId && subject.lotId) {
        throw new Error('set up collectedItemId and lotId prev trans')
    } else if (subject.bulkSplitId && subject.lotId) {
        throw new Error('set up bulkSplitId and lotId prev trans')
    } else if (subject.collectedItemId) {
        const transactions = await Transaction.selectForCollectedItem(subject.collectedItemId, 1, timeCutoff)
        if (transactions.length === 0) return undefined
        return transactions[transactions.length-1]
    } else if (subject.bulkSplitId) {
        const transactions = await Transaction.selectForBulkSplit(subject.bulkSplitId, 1, timeCutoff)
        if (transactions.length === 0) return undefined
        return transactions[transactions.length-1]
    } else if (subject.lotId) {
        const transactions = await Transaction.selectForLot(subject.lotId, 1, timeCutoff)
        if (transactions.length === 0) return undefined
        return transactions[transactions.length-1]
    } else {
        throw new Error('sad path previousTransaction')
    }
}

const previousOwner = async ({ lotId, collectedItemId, bulkSplitId }, startTime) => {
    let sellerId = undefined
    let sellerName = undefined
    let ownerProxyCreatorId = undefined
    if (lotId) {
        let subject = { lotId: lotId, timeCutoff: startTime.toISOString() }
        while (!sellerId) {
            const prev = await previousTransaction(subject)
            if (!prev) {
                if (subject.lotId) {
                    const lotEdits = await LotEdit.selectByFilter({ lotId: subject.lotId })
                    const sortedLotEdits = lotEdits.sort((a, b) => {
                        const aTime = new Date(a.time)
                        const bTime = new Date(b.time)
                        if (aTime < bTime) return -1
                        if (aTime > bTime) return 1
                        return 0
                    })
                    const { id: lotEditId } = sortedLotEdits[0]
                    const inserts = await LotInsert.selectByFilter({ lotEditId })
                    const { collectedItemId, bulkSplitId } = inserts[0]
                    subject = { collectedItemId, bulkSplitId, timeCutoff: subject.timeCutoff }
                } else {
                    throw new Error('broken transaction chain')
                }
            }else if (prev.giftId) {
                const gift = await Gift.getById(prev.giftId)
                sellerId = gift.recipientId
                sellerName = gift.recipientName
                ownerProxyCreatorId = gift.proxyCreatorId
            } else if (prev.importId) {
                const imp = await Import.getById(prev.importId)
                sellerId = imp.importerId
                sellerName = imp.importerName
                ownerProxyCreatorId = imp.proxyCreatorId
            } else if (prev.saleId) {
                const sale = await Sale.getById(prev.saleId)
                sellerId = sale.purchaserId
                sellerName = sale.purchaserName
                ownerProxyCreatoryId = sale.proxyCreatorId
            } else if (prev.lotEditId) {
                subject = { ...subject, timeCutoff: prev.time.toISOString() }
            } else {
                throw new Error('prev transaction not accounted for.')
            }
        }
    } else if (collectedItemId) {
        let subject = { collectedItemId, timeCutoff: startTime.toISOString() }
        while (!sellerId) {
            const prev = await previousTransaction(subject)
            if (!prev) {
                throw new Error('broken transaction chain')
            } else if (prev.giftId) {
                const gift = await Gift.getById(prev.giftId)
                sellerId = gift.recipientId
                sellerName = gift.recipientName
                ownerProxyCreatorId = gift.proxyCreatorId
            } else if (prev.importId) {
                const imp = await Import.getById(prev.importId)
                sellerId = imp.importerId
                sellerName = imp.importerName
                ownerProxyCreatorId = imp.proxyCreatorId
            } else if (prev.saleId) {
                const sale = await Sale.getById(prev.saleId)
                sellerId = sale.purchaserId
                sellerName = sale.purchaserName
                ownerProxyCreatoryId = sale.proxyCreatorId
            } else if (prev.lotEditId) {
                subject = { ...subject, timeCutoff: prev.time.toISOString() }
            } else {
                throw new Error('prev transaction not accounted for.')
            }
        }
    } else if (bulkSplitId) {
        let subject = { bulkSplitId, timeCutoff: startTime.toISOString() }
        while (!sellerId) {
            const prev = await previousTransaction(subject)
            if (!prev) {
                throw new Error('broken transaction chain')
            } else if (prev.giftId) {
                const gift = await Gift.getById(prev.giftId)
                sellerId = gift.recipientId
                sellerName = gift.recipientName
                ownerProxyCreatorId = gift.proxyCreatorId
            } else if (prev.importId) {
                const imp = await Import.getById(prev.importId)
                sellerId = imp.importerId
                sellerName = imp.importerName
                ownerProxyCreatorId = imp.proxyCreatorId
            } else if (prev.saleId) {
                const sale = await Sale.getById(prev.saleId)
                sellerId = sale.purchaserId
                sellerName = sale.purchaserName
                ownerProxyCreatoryId = sale.proxyCreatorId
            } else if (prev.lotEditId) {
                subject = { ...subject, timeCutoff: prev.time.toISOString() }
            } else {
                throw new Error('prev transaction not accounted for.')
            }
        }
    }
    return { sellerId, sellerName, ownerProxyCreatorId }
}

const getWatching = async (watcherId) => {
    const timeWithBackticks = '`time`'
    const descriptionWithBackticks = '`description`'
    const query = `
        SELECT 
            l.id,
            watchers.user_id as watcherId,
            ci.id as collectedItemId,
            bs.id as bulkSplitId,
            l.lotId,
            l.${timeWithBackticks} as listingTime,
            l.price as initialPrice,
            lp.price as updatedPrice,
            l.${descriptionWithBackticks} as description,
            seller.user_id as sellerId,
            seller.user_name as sellerName,
            w.id as watchingId
        FROM V3_Listing l
        LEFT JOIN V3_ListingPrice lp
            on lp.listingId = l.id
        LEFT JOIN V3_ListingPrice laterPrice
            ON laterPrice.listingId = l.id
            AND laterPrice.${timeWithBackticks} > lp.${timeWithBackticks}
        LEFT JOIN V3_ListingRemoval listR
            ON listR.listingId = l.id
            AND listR.${timeWithBackticks} > lp.${timeWithBackticks}
        LEFT JOIN V3_CollectedItem ci
            on ci.id = l.collectedItemId
        LEFT JOIN Item 
            on Item.id = ci.itemId
        LEFT JOIN V3_BulkSplit bs
            on bs.id = l.bulkSplitId
        LEFT JOIN V3_LotEdit le 
            ON le.lotId = l.lotId
            AND le.${timeWithBackticks} < l.${timeWithBackticks}
        LEFT JOIN V3_LotEdit lotEditBetweenLotEditAndListing
            ON lotEditBetweenLotEditAndListing.lotId = l.lotId
            AND lotEditBetweenLotEditAndListing.${timeWithBackticks} > le.${timeWithBackticks}
            AND lotEditBetweenLotEditAndListing.${timeWithBackticks} < l.${timeWithBackticks}
        LEFT JOIN V3_LotInsert li 
            on li.lotEditId = le.id
        LEFT JOIN V3_LotInsert betweenInsert 
            on betweenInsert.lotEditId = le.id 
            AND betweenInsert.id > li.id
        LEFT JOIN V3_LotRemoval lr on lr.lotEditId = le.id AND li.id IS NULL
        LEFT JOIN V3_LotRemoval betweenRemoval on betweenRemoval.lotEditId = le.id AND betweenRemoval.id > lr.id
        LEFT JOIN V3_LotInsert prevLotInsert 
            ON prevLotInsert.lotEditId != le.id
            AND (
                prevLotInsert.collectedItemId = li.collectedItemId 
                OR prevLotInsert.collectedItemId = lr.collectedItemId
                OR prevLotInsert.bulkSplitId = li.bulkSplitId
                OR prevLotInsert.bulkSplitId = lr.bulkSplitId
                OR prevLotInsert.collectedItemId = l.collectedItemId
                OR prevLotInsert.bulkSplitId = l.bulkSplitId
            )
        LEFT JOIN V3_LotEdit prevLotEdit 
            ON prevLotEdit.${timeWithBackticks} < l.${timeWithBackticks} -- listing time instead of lot edit time, because sale in question could be for collectedItem removed from purchased/gifted lot
            AND prevLotEdit.id = prevLotInsert.lotEditId
        LEFT JOIN V3_Listing prevListing
            ON prevListing.${timeWithBackticks} < l.${timeWithBackticks}
            AND prevListing.saleId IS NOT NULL
            AND (
                prevListing.collectedItemId = li.collectedItemId
                OR prevListing.collectedItemId = lr.collectedItemId
                OR prevListing.bulkSplitId = li.bulkSplitId
                OR prevListing.bulkSplitId = lr.bulkSplitId
                OR prevListing.lotId = l.lotId
                OR prevListing.lotId = prevLotEdit.lotId
                OR prevListing.collectedItemId = l.collectedItemId
                OR prevListing.bulkSplitId = l.bulkSplitId
            )
        LEFT JOIN V3_Sale prevSale
            ON prevSale.id = prevListing.saleId
            AND prevSale.${timeWithBackticks} < l.${timeWithBackticks}
        LEFT JOIN V3_Sale saleBetween
            ON saleBetween.id = prevListing.saleId
            AND saleBetween.${timeWithBackticks} < l.${timeWithBackticks} 
            AND saleBetween.${timeWithBackticks} > prevSale.${timeWithBackticks}
        LEFT JOIN V3_Gift prevGift
            ON prevGift.${timeWithBackticks} < l.${timeWithBackticks}
            AND prevGift.${timeWithBackticks} > prevSale.${timeWithBackticks}
            AND (
                prevGift.collectedItemId = li.collectedItemId
                OR prevGift.collectedItemId = lr.collectedItemId
                OR prevGift.bulkSplitId = li.bulkSplitId
                OR prevGift.bulkSplitId = lr.bulkSplitId
                OR prevGift.lotId = l.lotId
                OR prevGift.lotId = prevLotEdit.lotId
                OR prevGift.collectedItemId = l.collectedItemId
                OR prevGift.bulkSplitId = l.bulkSplitId
            )
        LEFT JOIN V3_Gift giftBetween
            ON (
                giftBetween.collectedItemId = li.collectedItemId
                OR giftBetween.collectedItemId = lr.collectedItemId
                OR giftBetween.bulkSplitId = li.bulkSplitId
                OR giftBetween.bulkSplitId = lr.bulkSplitId
                OR giftBetween.lotId = l.lotId
                OR giftBetween.lotId = prevLotEdit.lotId
                OR giftBetween.collectedItemId = l.collectedItemId
                OR giftBetween.bulkSplitId = l.bulkSplitId
            ) AND giftBetween.${timeWithBackticks} < l.${timeWithBackticks} 
            AND giftBetween.${timeWithBackticks} > prevGift.${timeWithBackticks}
        LEFT JOIN V3_Import i
            ON (
                i.collectedItemId = li.collectedItemId 
                OR i.collectedItemId = lr.collectedItemId
                OR i.bulkSplitId = li.bulkSplitId
                OR i.bulkSplitId = lr.bulkSplitId
                OR i.collectedItemId = l.collectedItemId
                OR i.bulkSplitId = l.bulkSplitId
            ) AND prevSale.id IS NULL 
            AND prevGift.id IS NULL
        LEFT JOIN V3_Watching w
            on w.listingId = l.id
        LEFT JOIN users as watchers
            on watchers.user_id = w.watcherId
        LEFT JOIN users seller
            ON seller.user_id = prevSale.purchaserId
            OR seller.user_id = prevGift.recipientId
            OR seller.user_id = i.importerId
        WHERE w.watcherId = ?
            AND l.saleId IS NULL
            AND (
                (li.id IS NOT NULL AND betweenInsert.id IS NULL) 
                OR (li.id IS NULL AND betweenRemoval.id IS NULL)
                OR l.collectedItemId IS NOT NULL
                OR l.bulkSplitId IS NOT NULL
            ) AND saleBetween.id IS NULL 
            AND giftBetween.id IS NULL 
            AND lotEditBetweenLotEditAndListing.id IS NULL
            AND laterPrice.id IS NULL
            AND listR.id IS NULL
        ORDER BY l.${timeWithBackticks} DESC;
    `
    const req = { queryQueue: [{ query, variables: [watcherId] }] }
    const res = {}
    let watchedListings
    await executeQueries(req, res, (err) => {
        if (err) throw err
        watchedListings = req.results
    })
    return watchedListings
}


const getById = async (listingId) => {
    const timeWithBackticks = '`time`'
    const descriptionWithBackticks = '`description`'
    const query = `
        SELECT 
            l.id,
            ci.id as collectedItemId,
            ci.printingId as printingId,
            a.conditionId as conditionId,
            SKU.id as skuId,
            bs.id as bulkSplitId,
            l.${timeWithBackticks} as listingTime,
            l.price as initialPrice,
            lp.price AS updatedPrice,
            l.${descriptionWithBackticks},
            l.saleId,
            i.id as itemId,
            i.name as name,
            i.tcgpId as tcgpId,
            l.lotId as lotId,
            sets_v2.set_v2_id as setId,
            sets_v2.set_v2_name as setName
        FROM V3_Listing l
        LEFT JOIN V3_ListingPrice lp
            on lp.listingId = l.id
        LEFT JOIN V3_ListingPrice laterPrice
            ON laterPrice.listingId = l.id
            AND laterPrice.${timeWithBackticks} > lp.${timeWithBackticks}
        LEFT JOIN V3_CollectedItem ci
            on ci.id = l.collectedItemId
        LEFT JOIN V3_Appraisal a
            on a.collectedItemId = ci.id
        LEFT JOIN V3_Appraisal laterAppraisal
            ON laterAppraisal.collectedItemId = ci.id
            AND laterAppraisal.${timeWithBackticks} > a.${timeWithBackticks}
        LEFT JOIN Item i
            on i.id = ci.itemId
        LEFT JOIN SKU
            on SKU.itemId = i.id
            AND SKU.printingId = ci.printingId
            AND SKU.conditionId = a.conditionId
        LEFT JOIN sets_v2
            on i.setId = sets_v2.set_v2_id
        LEFT JOIN V3_BulkSplit bs
            ON bs.id = l.bulkSplitId
        WHERE l.id = ?
            AND laterPrice.id IS NULL
            AND laterAppraisal.id IS NULL
        Group by l.id;
    `
    const req = { queryQueue: [{ query, variables: [listingId] }] }
    const res = {}
    let listing
    await executeQueries(req, res, (err) => {
        if (err) throw err
        listing = req.results[0]
    })
    const { lotId, collectedItemId, bulkSplitId } = listing
    const { sellerId, sellerName, ownerProxyCreatorId } = await previousOwner({ lotId, collectedItemId, bulkSplitId }, listing.listingTime)
    return {
        ...listing,
        sellerId,
        sellerName,
        ownerProxyCreatorId
    }
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

const prepZuluForDB = (local) => {
    return`${
        local.getUTCFullYear()}-${
        (local.getUTCMonth() + 1).toString().padStart(2, '0')}-${
        local.getUTCDate().toString().padStart(2, '0')}T${
        local.getUTCHours().toString().padStart(2, '0')}:${
        local.getUTCMinutes().toString().padStart(2, '0')}:${
        local.getUTCSeconds().toString().padStart(2, '0')}.${
        local.getMilliseconds().toString().padStart(3, '0')}`
}

const createExternal = async (listing, watcherId) => {
    const queryQueue = []
    if ((listing.items.length + listing.bulkSplits.length) === 0) {
        throw new Error("No item(s) specified within listing.")
    }
    const formattedImports = []
    // create collected items
    const isLot = listing.items.length + listing.bulkSplits.length > 1
    let importTime = adjustISOHours(listing.time, -1)
    if (isLot) importTime = adjustISOHours(listing.time, -2)
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
            // after listing created, user can create their own appraisal
            const formattedAppraisal = {
                id: appraisalId,
                collectedItemId,
                conditionId: item.condition,
                appraiserId: listing.sellerId,
                time: importTime
            }
            if (item.note) {
                const itemNoteId = uuidV4()
                // all notes are taken by the proxyCreator
                const formattedCollectedItemNote = {
                    id: itemNoteId, 
                    collectedItemId, 
                    takerId: watcherId,
                    note: item.note,
                    time: importTime
                }

                collectedItemNotesToInsert.push(formattedCollectedItemNote)
            }
            collectedItemsToInsert.push(formattedItem)
            appraisalsToInsert.push(formattedAppraisal)
            listing.items[idx] = { ...item, collectedItemId }
            // create import for item
            const importId = uuidV4();
            const formattedImport = {
                id: importId,
                importerId: listing.sellerId,
                collectedItemId,
                bulkSplitId: null,
                time: importTime
            }
            formattedImports.push(formattedImport)
        })
        queryQueue.push({ query: `${objectsToInsert(collectedItemsToInsert, 'V3_CollectedItem')};`, variables: [] })
        queryQueue.push({ query: `${objectsToInsert(appraisalsToInsert, 'V3_Appraisal')};`, variables: [] })
        if (collectedItemNotesToInsert.length > 0) {
            queryQueue.push({ query: `${objectsToInsert(collectedItemNotesToInsert, 'V3_CollectedItemNote')};`, variables: [] })
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
                    time: importTime
                }
                bulkSplitNotesToInsert.push(formattedBulkSplitNote)
            }             
            listing.bulkSplits[i] = { ...listing.bulkSplits[i], bulkSplitId }
            const bulkSplitLabels = await fetchOrCreateLabelIds(listing.bulkSplits[i])
            bulkSplitsToInsert.push(formattedBulkSplit)
            bulkSplitLabelsToInsert.push(...bulkSplitLabels)
            // create import for split
            const importId = uuidV4();
            const formattedImport = {
                id: importId,
                importerId: listing.sellerId,
                collectedItemId: null,
                bulkSplitId,
                time: importTime
            }
            formattedImports.push(formattedImport)
        }
        queryQueue.push({ query: `${objectsToInsert(bulkSplitsToInsert, 'V3_BulkSplit')};`, variables: [] })
        if (bulkSplitLabelsToInsert.length > 0) {
            queryQueue.push({ query: `${objectsToInsert(bulkSplitLabelsToInsert, 'V3_BulkSplitLabel')};`, variables: [] })  
        }
        if (bulkSplitNotesToInsert.length > 0) {
            queryQueue.push({ query: `${objectsToInsert(bulkSplitNotesToInsert, 'V3_BulkSplitNote')};`, variables: [] })  
        }
    }
    queryQueue.push({ query: `${objectsToInsert(formattedImports, 'V3_Import')};`, variables: [] })

    let collectedItemId = undefined
    let bulkSplitId = undefined
    let lotId = undefined
    if (isLot) {
        const lotEditTime = adjustISOHours(listing.time, -1)
        const formattedLotInsertsToInsert = []
        lotId = uuidV4();
        const formattedLot = {
            id: lotId
        }
        const lotEditId = uuidV4()
        const formattedLotEdit = {
            id: lotEditId,
            lotId,
            time: lotEditTime
        }
        listing.items.forEach((item, index) => {
            const { collectedItemId } = item
            const lotInsertId = uuidV4()
            const formattedLotInsert = {
                id: lotInsertId,
                lotEditId,
                collectedItemId,
                bulkSplitId: null,
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
                collectedItemId: null,
                bulkSplitId,
                index
            }
            formattedLotInsertsToInsert.push(formattedLotInsert)
        })
        queryQueue.push({ query: `${objectsToInsert([formattedLot], 'V3_Lot')};`, variables: [] })
        queryQueue.push({ query: `${objectsToInsert([formattedLotEdit], 'V3_LotEdit')};`, variables: [] })
        queryQueue.push({ query: `${objectsToInsert(formattedLotInsertsToInsert, 'V3_LotInsert')};`, variables: [] })
    } else if (listing.items.length > 0) {
        collectedItemId = listing.items[0].collectedItemId
    } else if (listing.bulkSplits.length > 0) {
        bulkSplitId = listing.bulkSplits[0].bulkSplitId
    }
    // create listing
    const listingId = uuidV4()
    const formattedListing = {
        id: listingId,
        collectedItemId,
        bulkSplitId,
        lotId,
        description: listing.description,
        saleId: undefined,
        time: listing.time,
        price: listing.price
    }
    queryQueue.push({ query: `${objectsToInsert([formattedListing], 'V3_Listing')};`, variables: [] })
    // create Watching
    const watchingId = uuidV4()
    const formattedWatching = { 
        id: watchingId, 
        listingId, 
        watcherId
    }
    queryQueue.push({ query: `${objectsToInsert([formattedWatching], 'V3_Watching')};`, variables: [] })
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
    queryQueue.push({ query: `${objectsToInsert([formattedGift], 'gifts')};`, variables: [] })
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
        queryQueue.push({ query: `${objectsToInsert(giftCardsToInsert, 'gift_cards')};`, variables: [] })
    }
    if (giftProductsToInsert.length > 0) {
        queryQueue.push({ query: `${objectsToInsert(giftProductsToInsert, 'gift_products')};`, variables: [] })
    }
    if (giftSplitsToInsert.length > 0) {
        queryQueue.push({ query: `${objectsToInsert(giftSplitsToInsert, 'gift_bulk_splits')};`, variables: [] })
    }
    if ((listing.cards.length + listing.products.length + listing.bulkSplits.length) > 1) {
        const { formattedLot, lotItemsToInsert, formattedListing } = formatListingWithLot(listing)
        formattedListing.saleId = listing.saleId
        queryQueue.push({ query: `${objectsToInsert([formattedLot], 'Lot')};`, variables: [] })
        queryQueue.push({ query: `${objectsToInsert(lotItemsToInsert, 'LotItem')};`, variables: [] })
        queryQueue.push({ query: `${objectsToInsert([formattedListing], 'Listing')};`, variables: [] })
        listingId = formattedListing.id
    } else {
        const formattedListing = formatListing(listing)
        formattedListing.saleId = listing.saleId
        queryQueue.push({ query: `${objectsToInsert([formattedListing], 'Listing')};`, variables: [] })
        listingId = formattedListing.id
    }
    const req = { queryQueue }
    const res = {}
    await executeQueries(req, res, (err) => {
        if (err) throw err
    })
    return listingId
}

const createPrice = async ({ listingId, price, time }) => {
    const queryQueue = []
    const priceTime = new Date(time)
    const id = uuidV4()
    const listingPriceToInsert = {
        id,
        listingId,
        price,
        time: prepZuluForDB(priceTime)
    }
    queryQueue.push({ query: `${objectsToInsert([listingPriceToInsert], 'V3_ListingPrice')};`, variables: [] })
    const req = { queryQueue }
    const res = {}
    await executeQueries(req, res, (err) => {
        if (err) throw err
    })
    return id
}

const create = async (listing) => {
    // TODO only owner of item(s) should have permissions
    // TODO if collected item in lot, can't list it seperately
    // TODO write utility function declaring if item listing makes sense with given history
    // create listing
    const { collectedItemId, bulkSplitId, lotId, description, time, price } = listing
    if (!collectedItemId && !bulkSplitId && !lotId) throw new Error('item, bulkSplit, or lot required to create listing.')
    if (!time) throw new Error('Time listing was created is required.')
    // TODO should mysql handle errors? It is successfully handling 'price cannot be null' error
    const id = uuidV4()
    const formattedListing = {
        id,
        collectedItemId,
        bulkSplitId,
        lotId,
        description,
        saleId: undefined,
        time,
        price
    }
    const req = { queryQueue: [{ query: `${objectsToInsert([formattedListing], 'V3_Listing')};`, variables: [] }] }
    const res = {}
    await executeQueries(req, res, (err) => {
        if (err) throw err
    })
    return id
}

module.exports = { 
    getWatching, 
    createExternal, 
    convertSaleItemsToListings, 
    getById, 
    createPrice,
    previousOwner,
    create
}
