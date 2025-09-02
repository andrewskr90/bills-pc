const { verifyCookie, decodeSessionToken, gymLeaderOnly } = require('../../middleware/auth-middleware')
const { createImportsConvertedFromGifts, createImports } = require('../../middleware/import-middleware')

const importRouter = require('express').Router()

importRouter.post('/',
    verifyCookie,
    decodeSessionToken,
    gymLeaderOnly,
    createImports,
    (req, res, next) => {
        res.status(201).json(req.results)
    }
)

importRouter.post('/converted-gifts',
    verifyCookie, 
    decodeSessionToken,
    gymLeaderOnly,
    createImportsConvertedFromGifts,
    (req, res, next) => {
        res.status(201).json(req.ids)
})

module.exports = importRouter
