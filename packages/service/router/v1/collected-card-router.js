const collectedCardRouter = require('express').Router()

const { verifyCookie, decodeSessionToken } = require('../../middleware/auth-middleware')
const { findCollectedCardsMySQL } = require('../../db/queries/collectedCardQueries')
collectedCardRouter.get('/', 
    verifyCookie,
    decodeSessionToken,
    findCollectedCardsMySQL,
    (req, res, next) => {
        res.status(200).json(req.collectedCards)
    }
)

module.exports = collectedCardRouter