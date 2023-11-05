const Listing = require('../models/Listing')

const formatListings = (listingItems) => {    
    const uniqueCollectedCards = {}
    const uniqueCollectedProducts = {}
    const mostRecentPriceFiltered = listingItems.sort((a, b) => {
        if (a.market_price_date > b.market_price_date) return -1
        if (a.market_price_date < b.market_price_date) return 1
        else return 0
    }).filter(item => {
        if (item.collected_card_id) {
            if (!uniqueCollectedCards[item.collected_card_id]) {
                uniqueCollectedCards[item.collected_card_id] = 1
                return true
            }
        } else if (item.collected_product_id) {
            if (!uniqueCollectedProducts[item.collected_product_id]) {
                uniqueCollectedProducts[item.collected_product_id] = 1
                return true
            }
        }
    })
    mostRecentPriceFiltered.sort((a, b ) => {
        if (a.listingId > b.listingId) return 1
        if (a.listingId < b.listingId) return -1
        else return 0
    })
    const listings = []
    let currentLot = {}
    mostRecentPriceFiltered.forEach((item, idx) => {
        if (item.lotId) {
            if (!currentLot.id) {
                currentLot = { id: item.lotId }
                if (item.card_v2_id) {
                    currentLot = {
                        ...currentLot,
                        items: [
                            {
                                collected_card_id: item.collected_card_id,
                                card_v2_id: item.card_v2_id,
                                card_v2_name: item.card_v2_name,
                                card_v2_number: item.card_v2_number,
                                card_v2_rarity: item.card_v2_rarity,
                                card_v2_tcgplayer_product_id: item.card_v2_tcgplayer_product_id,
                                card_v2_foil_only: item.card_v2_foil_only,
                                market_price_price: parseFloat(item.market_price_price)
                            }
                        ]
                    }
                } else if (item.product_id) {
                    currentLot = {
                        ...currentLot,
                        items: [
                            {
                                collected_product_id: item.collected_product_id,
                                product_id: item.product_id,
                                product_name: item.product_name,
                                product_release_date: item.product_release_date,
                                product_description: item.product_description,
                                product_tcgplayer_product_id: item.product_tcgplayer_product_id,
                                product_foil_only: item.product_foil_only,
                                market_price_price: parseFloat(item.market_price_price)
                            }
                        ]
                    }
                }
                if (mostRecentPriceFiltered[idx+1]) {
                    if (mostRecentPriceFiltered[idx+1].listingId !== item.listingId) {
                        listings.push({
                            id: item.listingId,
                            sellerId: item.sellerId,
                            sellerName: item.sellerName,
                            date: item.date,
                            price: parseFloat(item.price),
                            description: item.description,
                            collectedCard: { id: undefined },
                            collectedProduct: { id: undefined},
                            lot: { ...currentLot }  
                        })
                        currentLot = {}
                    }
                } else {
                    listings.push({
                        id: item.listingId,
                        sellerId: item.sellerId,
                        sellerName: item.sellerName,
                        date: item.date,
                        price: parseFloat(item.price),
                        description: item.description,
                        collectedCard: { id: undefined },
                        collectedProduct: { id: undefined},
                        lot: { ...currentLot }  
                    })
                }
            } else {
                if (item.card_v2_id) {
                    currentLot = {
                        ...currentLot,
                        items: [
                            ...currentLot.items,
                            {
                                collected_card_id: item.collected_card_id,
                                card_v2_id: item.card_v2_id,
                                card_v2_name: item.card_v2_name,
                                card_v2_number: item.card_v2_number,
                                card_v2_rarity: item.card_v2_rarity,
                                card_v2_tcgplayer_product_id: item.card_v2_tcgplayer_product_id,
                                card_v2_foil_only: item.card_v2_foil_only,
                                market_price_price: parseFloat(item.market_price_price)
                            }
                        ]
                    }
                } else if (item.product_id) {
                    currentLot = {
                        ...currentLot,
                        items: [
                            ...currentLot.items,
                            {
                                collected_product_id: item.collected_product_id,
                                product_id: item.product_id,
                                product_name: item.product_name,
                                product_release_date: item.product_release_date,
                                product_description: item.product_description,
                                product_tcgplayer_product_id: item.product_tcgplayer_product_id,
                                product_foil_only: item.product_foil_only,
                                market_price_price: parseFloat(item.market_price_price)
                            }
                        ]
                    }
                }
                if (mostRecentPriceFiltered[idx+1]) {
                    if (mostRecentPriceFiltered[idx+1].listingId !== item.listingId) {
                        listings.push({
                            id: item.listingId,
                            sellerId: item.sellerId,
                            sellerName: item.sellerName,
                            date: item.date,
                            price: parseFloat(item.price),
                            description: item.description,
                            collectedCard: { id: undefined },
                            collectedProduct: { id: undefined},
                            lot: { ...currentLot }  
                        })
                        currentLot = {}
                    }
                } else {
                    listings.push({
                        id: item.listingId,
                        sellerId: item.sellerId,
                        sellerName: item.sellerName,
                        date: item.date,
                        price: parseFloat(item.price),
                        description: item.description,
                        collectedCard: { id: undefined },
                        collectedProduct: { id: undefined},
                        lot: { ...currentLot }  
                    })
                }
            }
        } else {
            if (item.card_v2_id) {
                listings.push({
                    id: item.listingId,
                    sellerId: item.sellerId,
                    sellerName: item.sellerName,
                    date: item.date,
                    price: parseFloat(item.price),
                    description: item.description,
                    collectedCard: { ...item, id: item.collected_card_id },
                    collectedProduct: { id: item.collected_product_id },
                    lot: { id: item.lotId, items: [] }
                })
            } else {
                listings.push({
                    id: item.listingId,
                    sellerId: item.sellerId,
                    sellerName: item.sellerName,
                    date: item.date,
                    price: parseFloat(item.price),
                    description: item.description,
                    collectedCard: { id: item.collected_card_id },
                    collectedProduct: { ...item, id: item.collected_product_id },
                    lot: { id: item.lotId, items: [] }                
                })
            }
        }
    })
    return listings
}

const getListings = async (req, res, next) => {
    if (req.query.watching) {
        try {
            const watchedListings = await Listing.getWatching(req.claims.user_id)
            req.results = formatListings(watchedListings)
        } catch (err) {
            return next(err)
        }
    } else {
        return next({ status: 404, message: 'no such route' })
    }
    next()
}

const createListing = async (req, res, next) => {
    if (req.query.external) {
        try {
            const listingId = await Listing.createExternal(req.body, req.claims.user_id)
            req.results = { message: "Created.", data: listingId }
        } catch (err) {
            return next(err)
        }
    } else {
        return next({ status: 404, message: 'no such route' })
    }
    next()
}

module.exports = { getListings, createListing }