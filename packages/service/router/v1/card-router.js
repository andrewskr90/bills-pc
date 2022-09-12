const cardRouter = require('express').Router()
const { verifyCookie, decodeSessionToken, gymLeaderOnly } = require('../../middleware/auth-middleware')
const { addCardsMySQL, getCardsBySetIdMySQL } = require('../../db/queries/cardQueries')
const { generateCardIds, formatCardFromTcgPlayerDetails } = require('../../middleware/card-middleware')
const QueueQueries = require('../../middleware/QueueQueries')
const { executeQueries } = require('../../db')

cardRouter.get('/set-id/:setId', 
    verifyCookie,
    decodeSessionToken,
    QueueQueries.init,
    QueueQueries.cards.select,
    executeQueries,
    // getCardsBySetIdMySQL,
    (req, res, next) => {
        const results = req.results
        res.status(200).json(results)
})

cardRouter.post('/',
    verifyCookie, 
    decodeSessionToken,
    gymLeaderOnly,
    generateCardIds,
    addCardsMySQL,
    (req, res, next) => {
        const results = req.results
        res.status(201).json({
            data: results
        })
})

module.exports = cardRouter
