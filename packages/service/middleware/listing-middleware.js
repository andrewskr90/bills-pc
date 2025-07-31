const Listing = require('../models/Listing')
const SKU = require('../models/SKU')
const CollectedItem = require('../models/CollectedItem')
const BulkSplit = require('../models/BulkSplit')
const MarketPrice = require('../models/MarketPrice')
const { buildLotFromId } = require('./lot-middleware')

const  formatListings = (listings) => {    
    return listings.map((listing) => {
        const { 
            id,
            sellerId,
            sellerName,
            listingTime,
            initialPrice,
            description,
            updatedPrice,
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
            updatedPrice,
            collectedItem: { id: collectedItemId },
            bulkSplit: { id: bulkSplitId },
            lot: { id: lotId },
            saleId
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

        const { itemId, printingId, conditionId } = item
        if (priceLib[itemId]) {
            if (priceLib[itemId][printingId]) {
                if (priceLib[itemId][printingId][conditionId]) {
                    const { marketPriceDate, marketPrice } = priceLib[itemId][printingId][conditionId]
                    return {
                        ...item, 
                        marketPriceDate, 
                        marketPrice: parseFloat(marketPrice)
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
    if (req.query.proxy) {
        try {
            const watchedListings = await Listing.getProxy(req.claims.user_id)
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
        today.setMonth(today.getMonth()-1)
        const yesterday = new Date(today)
        yesterday.setDate(today.getDate()-1)
        if (listing.lotId) {
            const items = await buildLotFromId(listing.lotId)
            const formattedListing = formatListings([listing])[0]
            req.results = {
                ...formattedListing,
                lot: {
                    ...formattedListing.lot,
                    items
                }
            }
        } else if (listing.collectedItemId) {
            const formattedListing = formatListings([listing])[0]
            const collectedItem = await CollectedItem.getById(formattedListing.collectedItem.id, req.claims.user_id, new Date().toISOString())

            const itemPrices = await MarketPrice.selectByItemIdsBetweenDates(
                [{ 
                    itemId: collectedItem.item.id, 
                    printingId: collectedItem.printing.id, 
                    conditionId: collectedItem.appraisal.condition.id 
                }],
                yesterday,
                today
            )
            const itemWithPrices = tiePricesToItems(
                [{ 
                    itemId: collectedItem.item.id, 
                    printingId: collectedItem.printing.id, 
                    conditionId: collectedItem.appraisal.condition.id 
                }], 
                itemPrices
            )[0]
            req.results = {
                ...formattedListing,
                collectedItem: {
                    ...formattedListing.collectedItem,
                    ...itemWithPrices,
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

const formatCsvItems = async (csvItems) => {
    const offset = 50
    let pageSkus = []
    const formattedCsvItems = []
    for (let i=0; i<csvItems.length; i++) {
        pageSkus.push(csvItems[i].sku)
        if (((i+1)%offset === 0) || i === csvItems.length-1) {
            const skus = await SKU.findByTcgpIds(pageSkus)
            const skusWithMultiples = skus.reduce((prev, cur) => {
                const itemsBySku = []
                const { quantity } = csvItems.find(item => parseInt(item.sku) === cur.tcgpId)
                const formattedItem = {
                    id: cur.itemId,
                    printing: cur.printingId,
                    condition: cur.conditionId
                }
                for (let l=0; l<quantity; l++) {
                    itemsBySku.push(formattedItem)
                }
                return [...prev, ...itemsBySku]
            }, [])

            formattedCsvItems.push(...skusWithMultiples)
            pageSkus = []
        }
    }
    return formattedCsvItems
}

const createListing = async (req, res, next) => {
    if (req.query.external) {
        try {
            const { csvItems } = req.body
            delete req.body.csvItems
            const externalListing = req.body
            if (csvItems.length > 0) {
                externalListing.items = await formatCsvItems(csvItems)
            }
            const listingId = await Listing.createExternal(externalListing, req.claims.user_id)
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
        try {
        // TODO permissions for item
        const listingId = await Listing.create(req.body)
        req.results = { message: "Created.", date: listingId }
        } catch (err) {
            return next(err)
        }
    }
    next()
}

module.exports = { getListings, createListing, getListingById, tiePricesToItems }