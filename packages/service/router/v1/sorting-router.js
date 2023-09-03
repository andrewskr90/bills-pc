const sortingRouter = require('express').Router()

const { verifyCookie, decodeSessionToken } = require('../../middleware/auth-middleware')
const { formatSortings } = require('../../middleware/sorting-middleware')
const QueueQueries = require('../../middleware/QueueQueries')
const { executeQueries } = require('../../db')

sortingRouter.post('/', 
    verifyCookie,
    decodeSessionToken,
    formatSortings,
    QueueQueries.init,
    QueueQueries.bulkSplits.insert,
    QueueQueries.collectedCards.insert,
    QueueQueries.sortings.insert,
    QueueQueries.sortingSplits.insert,
    QueueQueries.sortingGems.insert,
    executeQueries,
    (req, res, next) => {
        res.status(201).json(req.results)
})

module.exports = sortingRouter
