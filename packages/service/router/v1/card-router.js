const cardRouter = require('express').Router()
const { verifySession, decodeJwt, gymLeaderOnly } = require('../../middleware/auth-middleware')
const { addCardsMySQL, getCardsBySetIdMySQL } = require('../../db/queries/cardQueries')
const { generateCardIds } = require('../../middleware/card-middleware')

cardRouter.get('/set-id/:setId', 
    verifySession,
    decodeJwt,
    getCardsBySetIdMySQL,
    (req, res, next) => {
        const results = req.results
        res.status(200).json(results)
})

cardRouter.post('/',
    verifySession, 
    decodeJwt,
    gymLeaderOnly,
    generateCardIds,
    addCardsMySQL,
    (req, res, next) => {
        const results = req.results
        res.status(200).json({
            data: results
        })
})

module.exports = cardRouter