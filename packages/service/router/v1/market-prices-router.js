const marketPricesRouter = require('express').Router()
const { verifyCookie, decodeSessionToken, gymLeaderOnly } = require('../../middleware/auth-middleware')
const { addMarketPricesMySQL } = require('../../db/queries/marketPriceQueries')
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
        res.status(201).json({
            data: results
        })
})

module.exports = marketPricesRouter