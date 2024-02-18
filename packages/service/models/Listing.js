const { executeQueries } = require('../db/index')
const { fetchOrCreateLabelIds } = require('../utils/bulk-splits')
const { objectsToInsert } = require("../utils/queryFormatters")
const { v4: uuidV4 } = require('uuid')

const dateWithBackticks = '`date`'
const descriptionWithBackticks = '`description`'

const getPurchased = async (purchaserId) => {
    // TODO: FIND SELLER OF LISTING ITEM
    const query = `
        SELECT 
            *
        FROM Listing
        RIGHT JOIN sales
            ON sales.sale_id = Listing.saleId
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
        LEFT JOIN bulk_splits
            ON bulk_splits.bulk_split_id = Listing.bulk_split_id
            OR bulk_splits.bulk_split_id = LotItem.bulk_split_id
        LEFT JOIN gift_cards
            ON gift_cards.gift_card_collected_card_id = collected_cards.collected_card_id
        LEFT JOIN gift_products
            ON gift_products.gift_product_collected_product_id = collected_products.collected_product_id
        LEFT JOIN gift_bulk_splits
            ON gift_bulk_splits.gift_bulk_split_bulk_split_id = bulk_splits.bulk_split_id
        LEFT JOIN gifts
            ON gifts.gift_id = gift_cards.gift_card_gift_id
            OR gifts.gift_id = gift_products.gift_product_gift_id
            OR gifts.gift_id = gift_bulk_splits.gift_bulk_split_gift_id
        LEFT JOIN users as purchasers
            on purchasers.user_id = sales.sale_purchaser_id
        LEFT JOIN users as sellers
            on sellers.user_id = gifts.gift_receiver_id
        WHERE sales.sale_purchaser_id = '${purchaserId}'
        GROUP BY collected_cards.collected_card_id, collected_products.collected_product_id
        ORDER BY gifts.gift_date desc;

    `
    const req = { queryQueue: [query] }
    const res = {}
    let purchasedListings
    await executeQueries(req, res, (err) => {
        if (err) throw err
        purchasedListings = req.results
    })
    return purchasedListings
}

const getWatching = async (watcherId) => {
    const query = `
        SELECT 
            Listing.id as listingId,
            sellers.user_id as sellerId,
            sellers.user_name as sellerName,
            watchers.user_id as watcherId,
            collected_cards.collected_card_id,
            collected_products.collected_product_id,
            bulk_splits.bulk_split_id,
            Listing.${dateWithBackticks},
            Listing.price,
            Listing.${descriptionWithBackticks},
            gift_cards.gift_card_id,
            gift_products.gift_product_id,
            gift_bulk_splits.gift_bulk_split_id,
            Watching.id as watchingId,
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
            Lot.id as lotId
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
        LEFT JOIN bulk_splits
            ON bulk_splits.bulk_split_id = Listing.bulk_split_id
            OR bulk_splits.bulk_split_id = LotItem.bulk_split_id
        LEFT JOIN gift_cards
            ON gift_cards.gift_card_collected_card_id = collected_cards.collected_card_id
        LEFT JOIN gift_products
            ON gift_products.gift_product_collected_product_id = collected_products.collected_product_id
        LEFT JOIN gift_bulk_splits
            ON gift_bulk_splits.gift_bulk_split_bulk_split_id = bulk_splits.bulk_split_id
        LEFT JOIN gifts
            ON gifts.gift_id = gift_cards.gift_card_gift_id
            OR gifts.gift_id = gift_products.gift_product_gift_id
            OR gifts.gift_id = gift_bulk_splits.gift_bulk_split_gift_id
        LEFT JOIN users as sellers
            on sellers.user_id = gifts.gift_receiver_id
        LEFT JOIN Watching
            on Watching.listingId = Listing.id
        LEFT JOIN users as watchers
            on watchers.user_id = Watching.watcherId
        WHERE Watching.watcherId = '${watcherId}' AND Listing.saleId IS NULL;
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
        if (collectedCardNotesToInsert.length > 0) {
            queryQueue.push(`${objectsToInsert(collectedCardNotesToInsert, 'collected_card_notes')};`)
        }
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
        if (collectedProductNotesToInsert.length > 0) {
            queryQueue.push(`${objectsToInsert(collectedProductNotesToInsert, 'collected_product_notes')};`)
        }
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
        if (bulkSplitLabelAssignmentsToInsert.length > 0) {
            queryQueue.push(`${objectsToInsert(bulkSplitLabelAssignmentsToInsert, 'bulk_split_label_assignments')};`)  
        }
        if (bulkSplitNotesToInsert.length > 0) {
            queryQueue.push(`${objectsToInsert(bulkSplitNotesToInsert, 'bulk_split_notes')};`)  
        }
    }
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
    // at this point, all items are imported into proxy user's collection, now create listing with item or lot
    let listingId
    if ((listing.cards.length + listing.products.length + listing.bulkSplits.length) > 1) {
        const { formattedLot, lotItemsToInsert, formattedListing } = formatListingWithLot(listing)
        queryQueue.push(`${objectsToInsert([formattedLot], 'Lot')};`)
        queryQueue.push(`${objectsToInsert(lotItemsToInsert, 'LotItem')};`)
        queryQueue.push(`${objectsToInsert([formattedListing], 'Listing')};`)
        listingId = formattedListing.id
    } else {
        const formattedListing = formatListing(listing)
        queryQueue.push(`${objectsToInsert([formattedListing], 'Listing')};`)
        listingId = formattedListing.id
    }
    // create Watching
    const formattedWatching = { 
        id: uuidV4(), 
        listingId, 
        watcherId 
    }
    queryQueue.push(`${objectsToInsert([formattedWatching], 'Watching')};`)
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
    console.log(queryQueue)
    const req = { queryQueue }
    const res = {}
    // await executeQueries(req, res, (err) => {
    //     if (err) throw err
    // })
    return listingId
}

module.exports = { getWatching, createExternal, convertSaleItemsToListings, getPurchased }
