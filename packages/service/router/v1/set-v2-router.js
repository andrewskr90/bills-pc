const setV2Router = require('express').Router()
const { checkReqBody } = require('../../middleware')
const { verifyCookie, decodeSessionToken, gymLeaderOnly } = require('../../middleware/auth-middleware')
const { addSetsV2MySQL, getSetsV2MySQL } = require('../../db/queries/setV2Queries')
const { generateSetV2Ids } = require('../../middleware/set-v2-middleware')

const QueueQueries = require('../../middleware/QueueQueries')
const { executeQueries } = require('../../db')

setV2Router.get('/', 
    // verifyCookie,
    // decodeSessionToken,
    QueueQueries.init,
    QueueQueries.setsV2.select,
    executeQueries,
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
    addSetsV2MySQL, 
    (req, res, next) => {
        const results = {
            ...req.results,
            addedSets: req.sets
        }
        res.status(201).json(results)
})

setV2Router.put('/:set_v2_id',
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
