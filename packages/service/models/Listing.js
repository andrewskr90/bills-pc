const { executeQueries } = require('../db/index')
const { fetchOrCreateLabelIds } = require('../utils/bulk-splits')
const { objectsToInsert } = require("../utils/queryFormatters")
const { v4: uuidV4 } = require('uuid')

const getWatching = async (watcherId) => {
    const dateWithBackticks = '`date`'
    const descriptionWithBackticks = '`description`'
    const query = `
        SELECT 
            Listing.id as listingId,
            sellers.user_id as sellerId,
            sellers.user_name as sellerName,
            watchers.user_id as watcherId,
            collected_cards.collected_card_id,
            collected_products.collected_product_id,
            Listing.${dateWithBackticks},
            Listing.price,
            Listing.${descriptionWithBackticks},
            card_v2_id,
            card_v2_name,
            card_v2_number,
            card_v2_rarity,
            card_v2_tcgplayer_product_id,
            card_v2_foil_only,
            product_id,
            product_name,
            product_release_date,
            product_description,
            product_tcgplayer_product_id,
            Lot.id as lotId,
            market_prices.market_price_price,
            market_prices.created_date as market_price_date
        FROM Listing
        LEFT JOIN Lot 
            on Lot.id = Listing.lotId
        LEFT JOIN LotItem 
            on LotItem.lotId = Lot.id
        LEFT JOIN collected_cards 
            on collected_cards.collected_card_id = Listing.collected_card_id
            OR collected_cards.collected_card_id = LotItem.collected_card_id
        LEFT JOIN cards_v2 
            on cards_v2.card_v2_id = collected_cards.collected_card_card_id
        LEFT JOIN collected_products
            on collected_products.collected_product_id = Listing.collected_product_id
            OR collected_products.collected_product_id = LotItem.collected_product_id
        LEFT JOIN products 
            on products.product_id = collected_products.collected_product_product_id
        LEFT JOIN market_prices
            on market_prices.market_price_card_id = cards_v2.card_v2_id
        LEFT JOIN ProxyImportItem
            on ProxyImportItem.collected_card_id = collected_cards.collected_card_id
        LEFT JOIN ProxyImport
            on ProxyImport.id = ProxyImportItem.proxyImportId
        LEFT JOIN users as sellers
            on sellers.user_id = ProxyImport.proxyUserId
        LEFT JOIN Watching
            on Watching.listingId = Listing.id
        LEFT JOIN users as watchers
            on watchers.user_id = Watching.watcherId
        WHERE Watching.watcherId = '${watcherId}'
            AND market_prices.created_date > NOW() - INTERVAL 1 DAY
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

const createExternal = async (listing, watcherId) => {
    const queryQueue = []
    if ((listing.cards.length + listing.products.length + listing.bulkSplits.length) === 0) {
        throw new Error("No item(s) specified within listing.")
    }
    // create collected items
    // collected cards
    if (listing.cards.length > 0) {
        const collectedCardsToInsert = []
        const collectedCardNotesToInsert = []
        listing.cards.forEach((card, idx) => {
            const collected_card_id = uuidV4()
            const formattedCard = {
                collected_card_id,
                collected_card_card_id: card.card_id,
            }
            if (card.note) {
                const collected_card_note_id = uuidV4()
                const formattedCollectedCardNote = {
                    collected_card_note_id, 
                    collected_card_note_collected_card_id: collected_card_id, 
                    collected_card_note_user_id: watcherId,
                    collected_card_note_note: card.note
                }
                collectedCardNotesToInsert.push(formattedCollectedCardNote)
            }
            collectedCardsToInsert.push(formattedCard)
            listing.cards[idx] = { ...card, collected_card_id }
        })
        queryQueue.push(`${objectsToInsert(collectedCardsToInsert, 'collected_cards')};`)
        queryQueue.push(`${objectsToInsert(collectedCardNotesToInsert, 'collected_card_notes')};`)
    }
    if (listing.products.length > 0) {
        // collected products
        const collectedProductsToInsert = []
        const collectedProductNotesToInsert = []
        listing.products.forEach((product, idx) => {
            const collected_product_id = uuidV4()
            const formattedProduct = {
                collected_product_id,
                collected_product_product_id: product.product_id,
            }
            if (product.note) {
                const collected_product_note_id = uuidV4()
                const formattedCollectedProductNote = {
                    collected_product_note_id, 
                    collected_product_note_collected_product_id: collected_product_id, 
                    collected_product_note_user_id: watcherId,
                    collected_product_note_note: product.note
                }
                collectedProductNotesToInsert.push(formattedCollectedProductNote)
            }            
            collectedProductsToInsert.push(formattedProduct)
            listing.products[idx] = { ...product, collected_product_id }
        })
        queryQueue.push(`${objectsToInsert(collectedProductsToInsert, 'collected_products')};`)
        queryQueue.push(`${objectsToInsert(collectedProductNotesToInsert, 'collected_product_notes')};`)
    }
    if (listing.bulkSplits.length > 0) {
        // bulk splits
        const bulkSplitsToInsert = []
        const bulkSplitLabelAssignmentsToInsert = []
        const bulkSplitNotesToInsert = []
        for (let i=0; i<listing.bulkSplits.length; i++) {
            const bulk_split_id = uuidV4()
            const formattedBulkSplit = {
                bulk_split_id,
                bulk_split_count: listing.bulkSplits[i].count,
                bulk_split_estimate: listing.bulkSplits[i].estimate
            }
            if (listing.bulkSplits[i].note) {
                const bulk_split_note_id = uuidV4()
                const formattedBulkSplitNote = {
                    bulk_split_note_id, 
                    bulk_split_note_bulk_split_id: bulk_split_id, 
                    bulk_split_note_user_id: watcherId,
                    bulk_split_note_note: listing.bulkSplits[i].note
                }
                bulkSplitNotesToInsert.push(formattedBulkSplitNote)
            }             
            listing.bulkSplits[i] = { ...listing.bulkSplits[i], bulk_split_id }
            const labelAssignments = await fetchOrCreateLabelIds(listing.bulkSplits[i])
            bulkSplitsToInsert.push(formattedBulkSplit)
            bulkSplitLabelAssignmentsToInsert.push(...labelAssignments)
        }
        queryQueue.push(`${objectsToInsert(bulkSplitsToInsert, 'bulk_splits')};`)  
        queryQueue.push(`${objectsToInsert(bulkSplitLabelAssignmentsToInsert, 'bulk_split_label_assignments')};`)  
        queryQueue.push(`${objectsToInsert(bulkSplitNotesToInsert, 'bulk_split_notes')};`)  
    }
    // create proxy import
    const proxyImportId = uuidV4();
    const formattedProxyImport = {
        id: proxyImportId,
        proxyUserId: listing.sellerId
    }
    queryQueue.push(`${objectsToInsert([formattedProxyImport], 'ProxyImport')};`)
    // create proxy import items
    const proxyImportItemsToInsert = []
    listing.cards.forEach(card => {
        const { collected_card_id } = card
        const formattedProxyImportCard = {
            id: uuidV4(),
            proxyImportId,
            collected_card_id,
            collected_product_id: null,
            bulk_split_id: null
        }
        proxyImportItemsToInsert.push(formattedProxyImportCard)
    })
    listing.products.forEach(product => {
        const { collected_product_id } = product
        const formattedProxyImportProduct = {
            id: uuidV4(),
            proxyImportId,
            collected_card_id: null,
            collected_product_id,
            bulk_split_id: null
        }
        proxyImportItemsToInsert.push(formattedProxyImportProduct)
    })    
    listing.bulkSplits.forEach(bulkSplit => {
        const { bulk_split_id } = bulkSplit
        const formattedProxyImportBulkSplit = {
            id: uuidV4(),
            proxyImportId,
            collected_card_id: null,
            collected_product_id: null,
            bulk_split_id
        }
        proxyImportItemsToInsert.push(formattedProxyImportBulkSplit)
    })
    queryQueue.push(`${objectsToInsert(proxyImportItemsToInsert, 'ProxyImportItem')};`)
    // at this point, all items are imported into proxy user's collection, now create listing with item or lot
    const listingId = uuidV4();
    const { date, price, description } = listing
    if ((listing.cards.length + listing.products.length + listing.bulkSplits.length) > 1) {
        // create lot
        const lotId = uuidV4();
        const formattedLot = {
            id: lotId,
        }
        queryQueue.push(`${objectsToInsert([formattedLot], 'Lot')};`)
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
        queryQueue.push(`${objectsToInsert(lotItemsToInsert, 'LotItem')};`)
        // create listing
        const formattedListing = {
            id: listingId,
            date,
            price,
            description,
            lotId: lotId,
            collected_card_id: null,
            collected_product_id: null,
            bulk_split_id: null
        }
        queryQueue.push(`${objectsToInsert([formattedListing], 'Listing')};`)
    } else {
        // create listing
        const formattedListing = {
            id: listingId,
            date,
            price,
            description,
            lotId: null,
            collected_card_id: null,
            collected_product_id: null,
            bulk_split_id: null
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
        queryQueue.push(`${objectsToInsert([formattedListing], 'Listing')};`)
    }
    // create Watching
    const formattedWatching = { id: uuidV4(), listingId, watcherId }
    queryQueue.push(`${objectsToInsert([formattedWatching], 'Watching')};`)
    const req = { queryQueue }
    const res = {}
    await executeQueries(req, res, (err) => {
        if (err) throw err
    })
    return listingId
}

module.exports = { getWatching, createExternal }
