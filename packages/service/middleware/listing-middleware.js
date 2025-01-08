const Listing = require('../models/Listing')
const LotEdit = require('../models/LotEdit')
const CollectedItem = require('../models/CollectedItem')
const BulkSplit = require('../models/BulkSplit')
const MarketPrice = require('../models/MarketPrice')
const { buildLotFromId } = require('./lot-middleware')
const { parseGroupConcat } = require('../utils')

const formatParsedDatePriceArray = (datePriceArray) => {
    return datePriceArray.map(array => {
        return array.map((value, idx) => {
            if (idx === 0) return parseInt(value)
            return parseFloat(value)
        })
    })
}

const parseThenFormatListingPrices = (unparsedListingPrices) => {
    return formatParsedDatePriceArray(parseGroupConcat(unparsedListingPrices))
}

const  formatListings = (listings) => {    
    return listings.map((listing) => {
        const { 
            id,
            sellerId,
            sellerName,
            listingTime,
            initialPrice,
            listingDescription: description,
            listingPrices,
            collectedItemId,
            bulkSplitId,
            lotId,
            saleId
        } = listing
        return {
            id,
            sellerId,
            sellerName,
            listingTime,
            initialPrice,
            description,
            listingPrices: parseThenFormatListingPrices(listingPrices),
            collectedItem: { id: collectedItemId },
            bulkSplit: { id: bulkSplitId },
            lot: { id: lotId },
            saleId
        }
    }).sort((a, b) => {
        if (a.time > b.time) return -1
        if (a.time < b.time) return 1
        return 0
    })
}

const formatItem = (item) => {
    return {
        collectedItemId: item.collectedItemId,
        itemId: item.itemId,
        name: item.name,
        tcgpId: item.tcgpId,
        setId: item.setId,
        index: item.index,
        setName: item.setName,
        printingId: item.printingId,  
        conditionId: item.appraisals[0][1],
        appraisals: item.appraisals,
        marketPrice: item.marketPrice ? parseFloat(item.marketPrice) : undefined,
        marketPriceDate: item.marketPriceDate
    }
}

const formatItems = (items) => {
    return items.map(lotItem => {
        if (lotItem.itemId) {
            return formatItem(lotItem)
        } else if (lotItem.bulkSplitId) {
            return lotItem
        }
    })
}


const uniqueItemPrintingConditionInListings = (listingItems) => {
    return listingItems.filter(item => item.itemId).map(item => ({
        itemId: item.itemId,
        conditionId: item.appraisals[0][1],
        printingId: item.printingId
    }))
}

const tiePricesToItems = (items, itemPrices) => {
    const priceLib = {}
    itemPrices.forEach(itemPrice => {
        if (itemPrice.itemId && itemPrice.marketPrice) {
            const { marketPrice, marketPriceDate, itemId, printingId, conditionId } = itemPrice
            priceLib[itemId] = {}
            priceLib[itemId][printingId] = {}
            priceLib[itemId][printingId][conditionId] = { marketPrice, marketPriceDate }
        }
    })
    return items.map(item => { 
        if (item.bulkSplitId) return item

        const { itemId, printingId, appraisals } = item
        const conditionId = appraisals[0][1]
        if (priceLib[itemId]) {
            if (priceLib[itemId][printingId]) {
                if (priceLib[itemId][printingId][conditionId]) {
                    const { marketPriceDate, marketPrice } = priceLib[itemId][printingId][conditionId]
                    return {
                        ...item, 
                        marketPriceDate, 
                        marketPrice
                    }
                }
            }

        }
        return { 
            ...item,
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
        const listing = await Listing.getById(req.params.id)
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(today.getDate()-1)
        if (listing.lotId) {
            let lotItems = await buildLotFromId(listing.lotId)
            const lotCollectedItems = lotItems.filter(li => li.collectedItemId)
            const lotItemsPrices = await MarketPrice.selectByItemIdsBetweenDates(
                uniqueItemPrintingConditionInListings(lotCollectedItems), 
                yesterday, 
                today
            )
            const lotItemsWithPrices = tiePricesToItems(lotItems, lotItemsPrices)
            const formattedLotItems = formatItems(lotItemsWithPrices)
            const formattedListing = formatListings([listing])[0]
            req.results = {
                ...formattedListing,
                lot: {
                    ...formattedListing.lot,
                    items: formattedLotItems
                }
            }
        } else if (listing.collectedItemId) {
            const formattedListing = formatListings([listing])[0]
            const collectedItem = await CollectedItem.getById(formattedListing.collectedItem.id)
            const itemPrices = await MarketPrice.selectByItemIdsBetweenDates(
                [collectedItem],
                yesterday,
                today
            )
            const itemWithPrices = tiePricesToItems([collectedItem], itemPrices)[0]
            const formattedItem = formatItem(itemWithPrices)
            req.results = {
                ...formattedListing,
                collectedItem: {
                    ...formattedListing.collectedItem,
                    ...formattedItem,
                }
            }
        } else if (listing.bulkSplitId) {
            const formattedListing = formatListings([listing])[0]
            const bulkSplit = await BulkSplit.getById(formattedListing.bulkSplit.id)
            req.results = {
                ...formattedListing,
                bulkSplit
            }        
        }
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

module.exports = { getListings, createListing, getListingById, tiePricesToItems, formatListings, parseThenFormatListingPrices }