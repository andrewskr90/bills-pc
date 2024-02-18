const Listing = require('../models/Listing')
const MarketPrice = require('../models/MarketPrice')

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
        } else if (item.bulk_split_id) return true
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
                } else if (item.bulk_split_id) {
                    currentLot = {
                        ...currentLot,
                        items: [
                            {
                               bulk_split_id: item.bulk_split_id
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
                 else if (item.bulk_split_id) {
                    currentLot = {
                        ...currentLot,
                        items: [
                            ...currentLot.items,
                            { bulk_split_id: item.bulk_split_id }
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
            } else if (item.product_id) {
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

const uniqueCardIdsInListings = (listings) => {
    const cardId = {}
    const productId = {}
    listings.forEach(listing => {
        if (listing.card_v2_id) {
            cardId[listing.card_v2_id] = 1
        } else if (listing.product_id) {
            productId[listing.product_id] = 1
        }
    })
    return {
        uniqueCards: Object.keys(cardId).filter(id => id),
        uniqueProducts: Object.keys(productId).filter(id => id)        
    }
}

const tiePricesToListings = (listings, cardPrices, productPrices) => {
    const cardPriceLib = {}
    const productPriceLib = {}
    cardPrices.forEach(price => {
        if (price.market_price_card_id && price.market_price_price) {
            cardPriceLib[price.market_price_card_id] = {
                market_price_price: price.market_price_price,
                market_price_date: price.created_date
            }
        }
    })
    productPrices.forEach(price => {
        if (price.market_price_product_id && price.market_price_price) {
            productPriceLib[price.market_price_product_id] = {
                market_price_price: price.market_price_price,
                market_price_date: price.created_date
            }
        }
    })
    return listings.map(listing => { 
        if (listing.card_v2_id && cardPriceLib[listing.card_v2_id]) {
            const { market_price_date, market_price_price } = cardPriceLib[listing.card_v2_id]
            return {
                ...listing, 
                market_price_date, 
                market_price_price
            }
        } else if (listing.product_id && productPriceLib[listing.product_id]) {
            const { market_price_date, market_price_price } = productPriceLib[listing.product_id]
            return {
                ...listing, 
                market_price_date, 
                market_price_price
            }
        }
        return { 
            ...listing,
            market_price_date: undefined,
            market_price_price: undefined
        }
    })
}

const getListings = async (req, res, next) => {
    if (req.query.watching) {
        try {
            const watchedListings = await Listing.getWatching(req.claims.user_id)
            const today = new Date()
            const yesterday = new Date(today)
            const { uniqueCards, uniqueProducts } = uniqueCardIdsInListings(watchedListings)
            yesterday.setDate(today.getDate()-1)
            let listingCardPrices = []
            let listingProductPrices = []
            if (uniqueCards.length > 0) {
                listingCardPrices = await MarketPrice.selectByCardIdsBetweenDates(uniqueCards, yesterday, today)
            }
            if (uniqueProducts.length > 0) {
                listingProductPrices = await MarketPrice.selectByProductIdsBetweenDates(uniqueProducts, yesterday, today)
            }
            const watchedListingsWithPrices = tiePricesToListings(watchedListings, listingCardPrices, listingProductPrices)
            req.results = formatListings(watchedListingsWithPrices)
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
    } else if (req.query.convertSaleItems) {
        try {
            const listingId = await Listing.convertSaleItemsToListings(req.body)
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