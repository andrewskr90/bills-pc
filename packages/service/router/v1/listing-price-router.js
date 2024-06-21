const { verifyCookie, decodeSessionToken } = require('../../middleware/auth-middleware')
const { createListingPrice } = require('../../middleware/listing-price-middleware')

const listingPrice = require('express').Router()

listingPrice.post('/', 
    verifyCookie,
    decodeSessionToken,
    createListingPrice,
    (req, res, next) => {
        res.status(201).json(req.results)
})

module.exports = listingPrice