const setV2Router = require('express').Router()
const { checkReqBody } = require('../../middleware')
const { verifyCookie, decodeSessionToken, gymLeaderOnly } = require('../../middleware/auth-middleware')
const { addSetsV2MySQL, getSetsV2MySQL } = require('../../db/queries/setV2Queries')
const { generateSetV2Ids } = require('../../middleware/set-v2-middleware')

setV2Router.get('/', 
    verifyCookie,
    decodeSessionToken,
    getSetsV2MySQL, 
    (req, res, next) => {
        res.status(200).json(req.results)
})

setV2Router.post('/', 
    verifyCookie,
    decodeSessionToken,
    gymLeaderOnly, 
    checkReqBody,
    generateSetV2Ids,
    addSetsV2MySQL, 
    (req, res, next) => {
        req.results = {
            ...req.results,
            addedSets: req.sets
        }
        res.status(201).json(req.results)
})

module.exports = setV2Router
