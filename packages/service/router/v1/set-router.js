const setRouter = require('express').Router()
const { verifyCookie, decodeSessionToken, gymLeaderOnly } = require('../../middleware/auth-middleware')
const { addSetsMySQL, getSetsMySQL } = require('../../db/queries/setQueries')
const { generateSetIds, formatSetFromTcgPlayerDetails } = require('../../middleware/set-middleware')

const QueueQueries = require('../../middleware/QueueQueries')
const { executeQueries } = require('../../db')

setRouter.get('/', 
    verifyCookie,
    decodeSessionToken,
    QueueQueries.init,
    QueueQueries.sets.select,
    executeQueries,
    (req, res, next) => {
        res.status(200).json(req.results)
})

setRouter.post('/', 
    verifyCookie,
    decodeSessionToken,
    gymLeaderOnly, 
    generateSetIds,
    addSetsMySQL, 
    (req, res, next) => {
        req.results = {
            ...req.results,
            addedSets: req.sets
        }
        res.status(201).json(req.results)
})

module.exports = setRouter
