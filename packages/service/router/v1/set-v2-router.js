const setV2Router = require('express').Router()
const { verifySession, decodeJwt, gymLeaderOnly } = require('../../middleware/auth-middleware')
const { addSetsV2MySQL, getSetsV2MySQL } = require('../../db/queries/setV2Queries')
const { generateSetIds, formatSetFromTcgPlayerDetails } = require('../../middleware/set-middleware')

setV2Router.get('/', 
    verifySession,
    decodeJwt,
    getSetsV2MySQL, 
    (req, res, next) => {
        res.status(200).json(req.results)
})

setV2Router.post('/', 
    verifySession,
    decodeJwt,
    gymLeaderOnly, 
    generateSetIds,
    formatSetFromTcgPlayerDetails,
    addSetsV2MySQL, 
    (req, res, next) => {
        req.results = {
            ...req.results,
            addedSets: req.sets
        }
        res.status(201).json(req.results)
})

module.exports = setV2Router
