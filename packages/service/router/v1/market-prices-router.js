const marketPricesRouter = require('express').Router()
const { verifyCookie, decodeSessionToken, gymLeaderOnly } = require('../../middleware/auth-middleware')
const { 
    formatMarketPricesFromConcat, 
    formatTopTenAverageResults
} = require('../../middleware/market-price-middleware')
const QueueQueries = require('../../middleware/QueueQueries')
const { executeQueries } = require('../../db')
const { formatItems } = require('../../middleware')


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

marketPricesRouter.get('/card-id/:card_id',
    QueueQueries.init,
    QueueQueries.marketPrices.selectByCardId,
    executeQueries,
    (req, res, next) => {
        res.status(200).json(req.results)
    }
)

marketPricesRouter.get('/product-id/:product_id',
    QueueQueries.init,
    QueueQueries.marketPrices.selectByProductId,
    executeQueries,
    (req, res, next) => {
        res.status(200).json(req.results)
    }
)

marketPricesRouter.get('/set-id/:set_v2_id',
    QueueQueries.init,
    QueueQueries.marketPrices.selectBySetId,
    executeQueries,    
    formatMarketPricesFromConcat,
    formatItems,
    (req, res, next) => {
        const results = req.results
        res.status(200).json(results)
    }
)

marketPricesRouter.get('/top-ten-average',
    QueueQueries.init,
    QueueQueries.marketPrices.selectTopTenAverage,
    executeQueries,
    formatTopTenAverageResults,    
    (req, res, next) => {
        const results = req.results
        res.status(200).json(results)
    }
)

module.exports = marketPricesRouter