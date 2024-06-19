const Listing = require('../models/Listing')
const MarketPrice = require('../models/MarketPrice')
const { parseGroupConcat } = require('../utils')

const formatListings = (listingItems) => {    
    let itemsToFormat = listingItems
    const listings = []
    let currentLot = {}

    itemsToFormat.forEach((item, idx) => {
        if (item.lotId) {
            if (!currentLot.id) {
                currentLot = { id: item.lotId }
                if (item.itemId) {
                    currentLot = {
                        ...currentLot,
                        items: [
                            {
                                collectedItemId: item.collectedItemId,
                                itemId: item.itemId,
                                name: item.name,
                                tcgpId: item.tcgpId,
                                setId: item.setId,
                                index: item.index,
                                setName: item.setName,
                                printingId: item.printingId,    
                                conditionId: item.conditionId,
                                marketPrice: parseFloat(item.marketPrice)
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
                if (itemsToFormat[idx+1]) {
                    if (itemsToFormat[idx+1].listingId !== item.listingId) {
                        listings.push({
                            id: item.listingId,
                            sellerId: item.sellerId,
                            sellerName: item.sellerName,
                            time: item.listingTime,
                            listingPrice: item.listingPrice,
                            description: item.description,
                            listingPrices: parseGroupConcat(item.listingPrices),
                            collectedItem: { id: undefined },
                            lot: { ...currentLot }  
                        })
                        currentLot = {}
                    }
                } else {
                    listings.push({
                        id: item.listingId,
                        sellerId: item.sellerId,
                        sellerName: item.sellerName,
                        time: item.listingTime,
                        listingPrice: item.listingPrice,
                        description: item.description,
                        listingPrices: parseGroupConcat(item.listingPrices),
                        collectedItem: { id: undefined },
                        lot: { ...currentLot }  
                    })
                }
            } else {
                if (item.itemId) {
                    currentLot = {
                        ...currentLot,
                        items: [
                            ...currentLot.items,
                            {
                                collectedItemId: item.collectedItemId,
                                itemId: item.itemId,
                                name: item.name,
                                tcgpId: item.tcgpId,
                                setId: item.setId,
                                index: item.index,
                                setName: item.setName,
                                printingId: item.printingId,    
                                conditionId: item.conditionId,
                                marketPrice: parseFloat(item.marketPrice)
                            }
                        ]
                    }
                } else if (item.bulk_split_id) {
                    currentLot = {
                        ...currentLot,
                        items: [
                            ...currentLot.items,
                            { bulk_split_id: item.bulk_split_id }
                        ]
                    }
                }
                if (itemsToFormat[idx+1]) {
                    if (itemsToFormat[idx+1].listingId !== item.listingId) {
                        listings.push({
                            id: item.listingId,
                            sellerId: item.sellerId,
                            sellerName: item.sellerName,
                            time: item.listingTime,
                            listingPrice: item.listingPrice,
                            description: item.description,
                            listingPrices: parseGroupConcat(item.listingPrices),
                            collectedItem: { id: undefined },
                            lot: { ...currentLot }  
                        })
                        currentLot = {}
                    }
                } else {
                    listings.push({
                        id: item.listingId,
                        sellerId: item.sellerId,
                        sellerName: item.sellerName,
                        time: item.listingTime,
                        listingPrice: item.listingPrice,
                        description: item.description,
                        listingPrices: parseGroupConcat(item.listingPrices),
                        collectedItem: { id: undefined },
                        lot: { ...currentLot }  
                    })
                }
            }
        } else {
            listings.push({
                id: item.listingId,
                sellerId: item.sellerId,
                sellerName: item.sellerName,
                time: item.listingTime,
                listingPrice: item.listingPrice,
                description: item.description,
                listingPrices: parseGroupConcat(item.listingPrices),
                collectedItem: { ...item, id: item.collectedItemId },
                bulkSplitId: { id: item.bulk_split_id },
                lot: { id: item.lotId, items: [] }
            })
        }
    })
    return listings.sort((a, b) => {
        if (a.time > b.time) return -1
        if (a.time < b.time) return 1
        return 0
    })
}

const uniqueItemPrintingConditionInListings = (listingItems) => {
    return listingItems.filter(item => item.itemId).map(item => ({
        itemId: item.itemId,
        conditionId: item.conditionId,
        printingId: item.printingId
    }))
}

const tiePricesToListings = (listings, itemPrices) => {
    const priceLib = {}
    itemPrices.forEach(itemPrice => {
        if (itemPrice.itemId && itemPrice.marketPrice) {
            const { marketPrice, marketPriceDate } = itemPrice
            priceLib[itemPrice.skuId] = { marketPrice, marketPriceDate }
        }
    })
    return listings.map(listing => { 
        if (listing.itemId && priceLib[listing.skuId]) {
            const { marketPriceDate, marketPrice } = priceLib[listing.skuId]
            return {
                ...listing, 
                marketPriceDate, 
                marketPrice
            }
        }
        return { 
            ...listing,
            marketPriceDate: undefined,
            marketPrice: undefined
        }
    })
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

const getListingById = async (req, res, next) => {
    try {
        const listingItems = await Listing.getListingById(req.params.id)
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(today.getDate()-1)
        const listingItemPrices = await MarketPrice.selectByItemIdsBetweenDates(uniqueItemPrintingConditionInListings(listingItems), yesterday, today)
        const watchedListingsWithPrices = tiePricesToListings(listingItems, listingItemPrices)
        req.results = formatListings(watchedListingsWithPrices)
    } catch (err) {
        next(err)
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

module.exports = { getListings, createListing, getListingById }