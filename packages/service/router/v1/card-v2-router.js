const cardV2Router = require('express').Router()
const { verifySession, decodeJwt, gymLeaderOnly } = require('../../middleware/auth-middleware')
const { addCardsV2MySQL, getCardsV2BySetIdMySQL } = require('../../db/queries/cardV2Queries')
const { generateCardIds, formatCardFromTcgPlayerDetails } = require('../../middleware/card-middleware')

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
    generateCardIds,
    formatCardFromTcgPlayerDetails,
    addCardsV2MySQL,
    (req, res, next) => {
        const results = req.results
        res.status(201).json({
            data: results
        })
})

module.exports = cardV2Router
