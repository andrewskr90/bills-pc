const setRouter = require('express').Router()
const { verifySession, decodeJwt, gymLeaderOnly } = require('../../middleware/auth-middleware')
const { addSetsMySQL, getSetsMySQL } = require('../../db/queries/setQueries')
const { generateSetIds, formatSetFromTcgPlayerDetails } = require('../../middleware/set-middleware')

setRouter.get('/', 
    verifySession,
    decodeJwt,
    getSetsMySQL, 
    (req, res, next) => {
        res.status(200).json(req.results)
})

setRouter.post('/', 
    verifySession,
    decodeJwt,
    gymLeaderOnly, 
    generateSetIds,
    formatSetFromTcgPlayerDetails,
    addSetsMySQL, 
    (req, res, next) => {
        req.results = {
            ...req.results,
            addedSets: req.sets
        }
        res.status(201).json(req.results)
})

module.exports = setRouter
