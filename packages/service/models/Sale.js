const QueueQueries = require('../middleware/QueueQueries')
const { executeQueries } = require('../db')
const { v4: uuidV4 } = require('uuid')
const QueryFormatters = require('../utils/queryFormatters')
const Listing = require('../models/Listing')
const { parseGroupConcat } = require('../utils')

const findByUserId = async (req, res, next) => {
    QueueQueries.init(req, res, (err) => {
        if (err) next(err)
    })
    QueueQueries.portfolio.selectByUserId(req, res, (err) => {
        if (err) next(err)
    })
    await executeQueries(req, res, (err) => {
        if (err) next(err)
    })
    next()
}

const select = async (userId) => {
    let query = `
        SELECT * FROM sales
        WHERE 
            sale_purchaser_id = ? OR
            sale_seller_id = ?
    ;`
    const req = { queryQueue: [{ query, variables: [userId, userId] }] }
    const res = {}
    let sales
    await executeQueries(req, res, (err) => {
        if (err) throw new Error(err)
        sales = req.results
    })
    return sales
}

const createFromListing = async ({ sale, listing }, purchaserId) => {
    const queryQueue = []
    try {
        const fetchedListing = await Listing.getById(listing.id)
        if (fetchedListing.saleId) throw new Error("Listing has already been sold.")
        if (fetchedListing.proxyCreatorId && fetchedListing.proxyCreatorId !== purchaserId) {
            throw new Error("You don't have permission to purchase this proxy listing.")
        }
        // TODO: offer is auto created, this form of listing creation will not
        // work if the offer already exists and the seller agrees to the offer.
        // making an offer does not exist in the app yet, for now it is just storing 
        // the final purchase price. *We are accepting an offer on behalf of the proxy user*
        if (listing.discounts.length > 0) {
            if (!parseFloat(listing.discounts[0].amount)) throw new Error("Listing discount is not a number.")
            if (parseFloat(listing.discounts[0].amount) <= 0) throw new Error("Listing discount must be greater than 0.")       
            const listingDiscounts = []
            listingDiscounts.push({
                id: uuidV4(),
                listingId: listing.id,
                amount: parseFloat(listing.discounts[0].amount),
                percentage: null
            })
            queryQueue.push({ query: QueryFormatters.objectsToInsert(listingDiscounts, 'V3_ListingDiscount'), variables: [] })
        }
        if (listing.offers.length > 0) {
            if (!parseFloat(listing.offers[0].amount)) throw new Error("Offer amount is not a number.")
            if (parseFloat(listing.offers[0].amount) <= 0) throw new Error("Offer amount must be greater than 0.")     
            if (parseFloat(listing.offers[0].amount) === parseFloat(parseGroupConcat(fetchedListing.listingPrices)[0][1])) {
                throw new Error("Offer amount must vary from current listing price.")
            }
            const offers = []
            offers.push({
                id: uuidV4(),
                listingId: listing.id,
                makerId: purchaserId,
                amount: parseFloat(listing.offers[0].amount)
            })
            queryQueue.push({ query: QueryFormatters.objectsToInsert(offers, 'V3_Offer'), variables: [] })
        }
        const { time } = sale
        let shipping = null
        let tax = null
        if (sale.shipping) {
            if (!parseFloat(sale.shipping)) throw new Error("Shipping is not a number.")
            if (parseFloat(sale.shipping) <= 0) throw new Error("Shipping must be greater than 0.")
            shipping = parseFloat(sale.shipping)
        }
        if (sale.tax) {
            if (!parseFloat(sale.tax)) throw new Error("Tax is not a number.")
            if (parseFloat(sale.tax) <= 0) throw new Error("Tax must be greater than 0.")  
            tax = parseFloat(sale.tax)
        }
        const formattedSale = {
            id: uuidV4(),
            purchaserId,
            shipping,
            tax,
            time
        }
        queryQueue.push({ query: `${QueryFormatters.objectsToInsert([formattedSale], 'V3_Sale')};`, variables: [] })
        queryQueue.push({ query: `UPDATE V3_Listing SET saleId = ? WHERE V3_Listing.id = ?;`, variables: [formattedSale.id, listing.id] })
        if (sale.discounts.length > 0) {
            if (!parseFloat(sale.discounts[0].amount)) throw new Error("Sale discount is not a number.")
            if (parseFloat(sale.discounts[0].amount) <= 0) throw new Error("Sale discount must be greater than 0.")  
            const saleDiscounts = []
            saleDiscounts.push({
                id: uuidV4(),
                saleId: formattedSale.id,
                amount: parseFloat(sale.discounts[0].amount),
                percentage: null
            })
            queryQueue.push({ query: QueryFormatters.objectsToInsert(saleDiscounts, 'V3_SaleDiscount'), variables: [] })
        }
        if (sale.notes.length > 0) {
            const saleNotes = []
            saleNotes.push({
                id: uuidV4(),
                saleId: formattedSale.id,
                takerId: purchaserId,
                note: sale.notes[0].note,
                time
            })
            queryQueue.push({ query: `${QueryFormatters.objectsToInsert(saleNotes, 'V3_SaleNote')};`, variables: [] })
        }
        const req = { queryQueue }
        const res = {}
        await executeQueries(req, res, (err) => {
            if (err) throw new Error(err)
            sales = req.results
        })    
        return sale.id
    } catch (err) {
        throw err
    }
}

module.exports = { 
    findByUserId, 
    select,
    createFromListing
}
