const Listing = require('../models/Listing')
const { parseGroupConcat } = require('../utils')

const createListingPrice = async (req, res, next) => {
    try {
        const { listingId, price, time } = req.body 
        if (!parseFloat(price)) return next({ status: 400, message: 'Price not submitted to update.' })
        if (!time) return next({ status: 400, message: 'Time of price update required.' })

        const userId = req.claims.user_id
        const listing = await Listing.getById(listingId)
        const { sellerId, proxyCreatorId, listingPrices, listingTime } = listing
        if (userId !== sellerId && userId !== proxyCreatorId) return next({ status: 400, message: 'User does not have permission to update' })
        const newPriceTime = new Date(time)
        if (newPriceTime < listingTime) return next({ status: 400, message: 'Time of price update must occur after most previous price assignment.' })
        const listingPrice = parseGroupConcat(listingPrices)[0][1]
        if (parseFloat(listingPrice) === parseFloat(price)) return next({ status: 400, message: 'Updated price matches existing price.' })
        const postedListingPriceId = await Listing.createPrice({ listingId, price })
        req.results = { createdId: postedListingPriceId }
        next()
    } catch (err) {
        return next(err)
    }
}

module.exports = { createListingPrice }