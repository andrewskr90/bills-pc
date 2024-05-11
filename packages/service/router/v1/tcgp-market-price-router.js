const { verifyCookie, decodeSessionToken, gymLeaderOnly } = require('../../middleware/auth-middleware')
const { createPrices } = require('../../middleware/tcgp-market-price-middleware')

const tcgpMarketPriceRouter = require('express').Router()

tcgpMarketPriceRouter.post('/',
    verifyCookie, 
    decodeSessionToken,
    gymLeaderOnly,
    createPrices,
    (req, res, next) => {
        res.status(201).json(req.ids)
})

module.exports = tcgpMarketPriceRouter
