const marketPricesRouter = require('express').Router()
const { verifyCookie, decodeSessionToken, gymLeaderOnly } = require('../../middleware/auth-middleware')
const { addMarketPricesMySQL, getMarketPricesMySQL } = require('../../db/queries/marketPriceQueries')
const QueueQueries = require('../../middleware/QueueQueries')
const { executeQueries } = require('../../db')


marketPricesRouter.post('/',
    verifyCookie, 
    decodeSessionToken,
    gymLeaderOnly,
    QueueQueries.init,
    QueueQueries.marketPrices.insert,
    executeQueries,
    (req, res, next) => {
        const results = req.results
        res.status(201).json(results)
})

marketPricesRouter.get('/',
    verifyCookie,
    decodeSessionToken,
    QueueQueries.init,
    QueueQueries.marketPrices.select,
    executeQueries,    
    (req, res, next) => {
        const results = req.results
        res.status(200).json(results)
    }
)

module.exports = marketPricesRouter