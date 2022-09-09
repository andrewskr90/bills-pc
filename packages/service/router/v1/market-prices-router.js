const marketPricesRouter = require('express').Router()
const { verifyCookie, decodeSessionToken, gymLeaderOnly } = require('../../middleware/auth-middleware')
const { addMarketPricesMySQL, getMarketPricesMySQL } = require('../../db/queries/marketPriceQueries')
// marketPricesRouter.get('/',
//     verifyCookie,
//     decodeSessionToken,
//     getProductsBySetIdMySQL,
//     (req, res, next) => {
//         const results = req.results
//         res.status(200).json(results)
// })

marketPricesRouter.post('/',
    verifyCookie, 
    decodeSessionToken,
    gymLeaderOnly,
    addMarketPricesMySQL,
    (req, res, next) => {
        const results = req.results
        res.status(201).json(results)
})

marketPricesRouter.get('/',
    verifyCookie,
    decodeSessionToken,
    getMarketPricesMySQL,
    (req, res, next) => {
        const results = req.results
        res.status(200).json(results)
    }
)

module.exports = marketPricesRouter