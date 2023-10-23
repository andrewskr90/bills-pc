const { verifyCookie, decodeSessionToken } = require('../../middleware/auth-middleware')
const { createListing, getListings } = require('../../middleware/listing-middleware')

const listingRouter = require('express').Router()

listingRouter.get('/',
    verifyCookie,
    decodeSessionToken,
    getListings,
    (req, res, next) => {
        res.status(200).json(req.results)
})

listingRouter.post('/', 
    verifyCookie,
    decodeSessionToken,
    createListing,
    (req, res, next) => {
        res.status(201).json(req.results)

})

module.exports = listingRouter
