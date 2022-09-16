const cardV2Router = require('express').Router()
const { verifyCookie, decodeSessionToken, gymLeaderOnly } = require('../../middleware/auth-middleware')
const { addCardsV2MySQL, getCardsV2BySetIdMySQL, getCardsV2MySQL } = require('../../db/queries/cardV2Queries')
const { generateCardV2Ids } = require('../../middleware/card-v2-middleware')
const QueueQueries = require('../../middleware/QueueQueries')
const { executeQueries } = require('../../db')

cardV2Router.get('/', 
    verifyCookie,
    decodeSessionToken,
    QueueQueries.init,
    QueueQueries.cardsV2.select,
    executeQueries,
    (req, res, next) => {
        const results = req.results
        res.status(200).json(results)
})

cardV2Router.get('/set-id/:setId', 
    verifyCookie,
    decodeSessionToken,
    QueueQueries.init,
    QueueQueries.cardsV2.selectBySetId,
    executeQueries,
    (req, res, next) => {
        const results = req.results
        res.status(200).json(results)
})

cardV2Router.post('/',
    verifyCookie, 
    decodeSessionToken,
    gymLeaderOnly,
    generateCardV2Ids,
    QueueQueries.init,
    QueueQueries.cardsV2.insert,
    executeQueries,
    (req, res, next) => {
        const results = req.results
        res.status(201).json({
            data: results
        })
})

module.exports = cardV2Router
