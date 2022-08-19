const cardV2Router = require('express').Router()
const { verifySession, decodeJwt, gymLeaderOnly } = require('../../middleware/auth-middleware')
const { addCardsV2MySQL, getCardsV2BySetIdMySQL, getCardsV2MySQL } = require('../../db/queries/cardV2Queries')
const { generateCardV2Ids } = require('../../middleware/card-v2-middleware')

cardV2Router.get('/', 
    verifySession,
    decodeJwt,
    getCardsV2MySQL,
    (req, res, next) => {
    const results = req.results
    res.status(200).json(results)
})

cardV2Router.get('/set-id/:setId', 
    verifySession,
    decodeJwt,
    getCardsV2BySetIdMySQL,
    (req, res, next) => {
        const results = req.results
        res.status(200).json(results)
})

cardV2Router.post('/',
    verifySession, 
    decodeJwt,
    gymLeaderOnly,
    generateCardV2Ids,
    addCardsV2MySQL,
    (req, res, next) => {
        const results = req.results
        res.status(201).json({
            data: results
        })
})

module.exports = cardV2Router
