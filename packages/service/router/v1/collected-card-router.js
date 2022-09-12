const collectedCardRouter = require('express').Router()

const { verifyCookie, decodeSessionToken } = require('../../middleware/auth-middleware')
const { findCollectedCardsMySQL } = require('../../db/queries/collectedCardQueries')

const QueueQueries = require('../../middleware/QueueQueries')
const { executeQueries } = require('../../db')

collectedCardRouter.get('/', 
    verifyCookie,
    decodeSessionToken,
    QueueQueries.init,
    QueueQueries.collectedCards.select,
    executeQueries,
    (req, res, next) => {
        res.status(200).json(req.results)
    }
)

module.exports = collectedCardRouter