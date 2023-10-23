const { executeQueries } = require('../db/index')
const { objectsToInsert } = require("../utils/queryFormatters")
const { v4: uuidV4 } = require('uuid')

const getWatching = async (watcherId) => {
    const dateWithBackticks = '`date`'
    const descriptionWithBackticks = '`description`'
    const query = `
        SELECT 
            Listing.id as listingId,
            ProxyUser.id as sellerId,
            ProxyUser.name as sellerName,
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
        LEFT JOIN ProxyUser
            on ProxyUser.id = ProxyImport.proxyUserId
        WHERE market_prices.created_date > NOW() - INTERVAL 1 DAY
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
    // create collected items
    // collected cards
    if (listing.cards.length > 0) {
        const collectedCardsToInsert = []
        listing.cards.forEach((card, idx) => {
            const collected_card_id = uuidV4()
            const formattedCard = {
                collected_card_id,
                collected_card_card_id: card.card_id,
            }
            collectedCardsToInsert.push(formattedCard)
            listing.cards[idx] = { ...card, collected_card_id }
        })
        queryQueue.push(`${objectsToInsert(collectedCardsToInsert, 'collected_cards')};`)
    } else if (listing.products.length > 0) {
        // collected products
        const collectedProductsToInsert = []
        listing.products.forEach((product, idx) => {
            const collected_product_id = uuidV4()
            const formattedProduct = {
                collected_product_id,
                collected_product_product_id: product.product_id,
            }
            collectedProductsToInsert.push(formattedProduct)
            listing.products[idx] = { ...product, collected_product_id }
        })
        queryQueue.push(`${objectsToInsert(collectedProductsToInsert, 'collected_products')};`)
    } else {
        throw new Error("No item(s) specified within listing.")
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
            collected_product_id: null
        }
        proxyImportItemsToInsert.push(formattedProxyImportCard)
    })
    listing.products.forEach(product => {
        const { collected_product_id } = product
        const formattedProxyImportProduct = {
            id: uuidV4(),
            proxyImportId,
            collected_card_id: null,
            collected_product_id
        }
        proxyImportItemsToInsert.push(formattedProxyImportProduct)
    })
    queryQueue.push(`${objectsToInsert(proxyImportItemsToInsert, 'ProxyImportItem')};`)
    // at this point, all items are imported into proxy user's collection, now create listing with item or lot
    const listingId = uuidV4();
    const { date, price, description } = listing
    if ((listing.cards.length + listing.products.length) > 1) {
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
                collected_product_id: null
            }
            lotItemsToInsert.push(formattedLotCard)
        })
        listing.products.forEach(product => {
            const { collected_product_id } = product
            const formattedLotProduct = {
                id: uuidV4(),
                lotId,
                collected_card_id: null,
                collected_product_id
            }
            lotItemsToInsert.push(formattedLotProduct)
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
            collected_product_id: null
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
            collected_product_id: null
        }
        if (listing.cards.length === 1) {
            const { collected_card_id } = listing.cards[0]
            formattedListing.collected_card_id = collected_card_id
        } else if (listing.product.length === 1) {
            const { collected_product_id } = listing.cards[0]
            formattedListing.collected_product_id = collected_product_id
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