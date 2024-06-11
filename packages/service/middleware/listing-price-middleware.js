const Listing = require('../models/Listing')

const createListingPrice = async (req, res, next) => {
    try {
        const { listingId, price } = req.body 
        const userId = req.claims.user_id
        const listingItems = await Listing.getListingById(listingId)
        const sortedListingItems = listingItems.sort((a, b) => {
            if (a.listingPriceTime < b.listingPriceTime) return -1
            else if (a.listingPriceTime > b.listingPriceTime) return 1
            else return 0
        })
        const { sellerId, proxyCreatorId, listingPrice } = sortedListingItems[0]
        if (!parseFloat(price)) return next({ status: 400, message: 'Price not submitted to update.' })
        if (parseFloat(listingPrice) === parseFloat(price)) return next({ status: 400, message: 'Updated price matches existing price.' })
        if (userId !== sellerId && userId !== proxyCreatorId) return next({ status: 400, message: 'User does not have permission to update' })
        const postedListingPriceId = await Listing.createPrice({ listingId, price })
        req.results = { createdId: postedListingPriceId }
        next()
    } catch (err) {
        return next(err)
    }
}

module.exports = { createListingPrice }