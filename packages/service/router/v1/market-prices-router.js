const marketPricesRouter = require('express').Router()
const { formatMarketPricesFromConcat } = require('../../middleware/market-price-middleware')
const QueueQueries = require('../../middleware/QueueQueries')
const { executeQueries } = require('../../db')
const { formatItems } = require('../../middleware')

marketPricesRouter.get('/item-id/:item_id',
    QueueQueries.init,
    QueueQueries.marketPrices.selectByItemId,
    executeQueries,
    formatMarketPricesFromConcat,
    formatItems,
    (req, res, next) => {
        res.status(200).json(req.results)
    }
)

module.exports = marketPricesRouter