const Listing = require('../models/Listing')
const { parseThenFormatListingPrices } = require('./listing-middleware')

const createListingPrice = async (req, res, next) => {
    try {
        const { listingId, price, time } = req.body 
        if (!parseFloat(price)) return next({ status: 400, message: 'Price not submitted to update.' })
        if (!time) return next({ status: 400, message: 'Time of price update required.' })

        const userId = req.claims.user_id
        const listing = await Listing.getById(listingId)
        listing.listingPrices = parseThenFormatListingPrices(listing.listingPrices)
        const { sellerId, ownerProxyCreatorId, listingPrices, listingTime, initialPrice } = listing
        if (userId !== sellerId && userId !== ownerProxyCreatorId) return next({ status: 400, message: 'User does not have permission to update' })
        const newPriceTime = new Date(time)
        if (newPriceTime < listingTime) return next({ status: 400, message: 'Time of price update must occur after listing was created.' })
        const currentPrice = listingPrices.length > 0 ? listingPrices[0] : [listingTime, initialPrice]
        const currentPriceTime = currentPrice[0]
        const currentPriceAmount = currentPrice[1]
        const formattedCurrentPriceTime = new Date(parseInt(currentPriceTime)*1000)
        if (newPriceTime < formattedCurrentPriceTime) return next({ status: 400, message: 'Time of price update must occur after most previous price assignment.' })
        if (parseFloat(currentPriceAmount) === parseFloat(price)) return next({ status: 400, message: 'Updated price matches existing price.' })
        const postedListingPriceId = await Listing.createPrice({ listingId, price, time })
        req.results = { createdId: postedListingPriceId }
        next()
    } catch (err) {
        return next(err)
    }
}

module.exports = { createListingPrice }