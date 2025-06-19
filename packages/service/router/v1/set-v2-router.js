const setV2Router = require('express').Router()
const { checkReqBody } = require('../../middleware')
const { verifyCookie, decodeSessionToken, gymLeaderOnly } = require('../../middleware/auth-middleware')
const { generateSetV2Ids, formatExpansions } = require('../../middleware/set-v2-middleware')

const QueueQueries = require('../../middleware/QueueQueries')
const { executeQueries } = require('../../db')

setV2Router.get('/', 
    QueueQueries.init,
    QueueQueries.setsV2.select,
    executeQueries,
    formatExpansions,
    (req, res, next) => {
        const results = req.results
        res.status(200).json(results)
})

setV2Router.post('/', 
    verifyCookie,
    decodeSessionToken,
    gymLeaderOnly, 
    checkReqBody,
    generateSetV2Ids,
    QueueQueries.init,
    QueueQueries.setsV2.insert,
    executeQueries, 
    (req, res, next) => {
        const results = {
            ...req.results,
            addedSets: req.sets
        }
        res.status(201).json(results)
})

setV2Router.patch('/:set_v2_id',
    verifyCookie,
    decodeSessionToken,
    gymLeaderOnly,
    QueueQueries.init,
    QueueQueries.setsV2.update,
    executeQueries,
    (req, res, next) => {
        res.status(200).json(req.results)
})

module.exports = setV2Router
