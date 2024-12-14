const expansionSeriesRouter = require('express').Router()

const QueueQueries = require('../../middleware/QueueQueries')
const { executeQueries } = require('../../db')
const { getExpansionSeries } = require('../../middleware/expansion-series-middleware')

expansionSeriesRouter.get('/', 
    QueueQueries.init,
    getExpansionSeries,
    executeQueries,
    (req, res, next) => {
        const results = req.results.map(result => result.set_v2_series)
        res.status(200).json(results)
})

module.exports = expansionSeriesRouter
