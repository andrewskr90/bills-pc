const QueueQueries = require('../middleware/QueueQueries')
const { executeQueries } = require('../db')
const { v4: uuidV4 } = require('uuid')
const { objectsToInsert } = require('../utils/queryFormatters')
const QueryFormatters = require('../utils/queryFormatters')

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
            sale_purchaser_id = '${userId}' OR
            sale_seller_id = '${userId}'
    ;`
    const req = { queryQueue: [query] }
    const res = {}
    let sales
    await executeQueries(req, res, (err) => {
        if (err) throw new Error(err)
        sales = req.results
    })
    return sales
}

const createFromListing = async (saleBody, purchaserId) => {
    const offers = []
    const saleNotes = []
    const queryQueue = []
    // TODO: offer is auto created, this form of listing creation will not
    // work if the offer already exists and the seller agrees to the offer.
    // making an offer does not exist in the app yet, for now it is just storing 
    // the final purchase price. *We are accepting an offer on behalf of the proxy user*

    // create offers for existing listings
    saleBody.listings.forEach(listing => {
        if (listing.offer) {
            offers.push({
                id: uuidV4(),
                amount: parseFloat(listing.offer.amount),
                buyerId: purchaserId,
                listingId: listing.id,
            })
        }
    })
    // TODO: only user obtaining the item in a transaction is recorded. The seller is 
    // calculated by finding the most recent transaction before this sale. If there is 
    // no previous transaction, they are the initial owner (gift / import) 

    // create sale for accepted offers
    const sale = {
        sale_id: uuidV4(),
        sale_seller_id: saleBody.listings[0].sellerId,
        sale_purchaser_id: purchaserId,
        sale_date: saleBody.date,
        sale_discount: saleBody.discount,
        sale_shipping: saleBody.shipping,
        sale_tax_amount: saleBody.tax,
    }
    if (saleBody.note) {
        saleNotes.push({
            sale_note_id: uuidV4(),
            sale_note_sale_id: sale.sale_id,
            sale_note_user_id: purchaserId,
            sale_note_note: saleBody.note,
        })
    }
    // update listings with accepted offers and sale
    queryQueue.push(`${QueryFormatters.objectsToInsert([sale], 'sales')};`)
    if (saleNotes.length > 0) {
        queryQueue.push(`${QueryFormatters.objectsToInsert(saleNotes, 'sale_notes')};`)
    }
    if (offers.length > 0) {
        queryQueue.push(QueryFormatters.objectsToInsert(offers, 'Offer'))
        queryQueue.push(offers.map(offer => {
            return `UPDATE Listing SET offerId = '${offer.id}' WHERE Listing.id = '${offer.listingId}';`
        }).join(' '))
    }
    queryQueue.push(saleBody.listings.map(listing => {
        return `UPDATE Listing SET saleId = '${sale.sale_id}' WHERE Listing.id = '${listing.id}';`
    }).join(' '))
    const req = { queryQueue }
    const res = {}
    await executeQueries(req, res, (err) => {
        if (err) throw new Error(err)
        sales = req.results
    })    
    return sale.sale_id
}

module.exports = { 
    findByUserId, 
    select,
    createFromListing
}
