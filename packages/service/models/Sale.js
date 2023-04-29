const { formatSaleResults } = require('../middleware/sale-middleware')
const QueueQueries = require('../middleware/QueueQueries')
const { executeQueries } = require('../db')

const findByUserId = async (req, res, next) => {
    QueueQueries.init(req, res, (err) => {
        if (err) next(err)
    })
    QueueQueries.portfolio.selectByUserId(req, res, (err) => {
        if (err) next(err)
    })
    await executeQueries(req, res, (err) => {
        if (err) next(err)
    })
    formatSaleResults(req, res, (err) => {
        if (err) next(err)
    })
    req.sales = req.results
    next()
}

module.exports = { findByUserId }
