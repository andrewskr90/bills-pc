const { verifyCookie, decodeSessionToken, gymLeaderOnly } = require('../../middleware/auth-middleware')
const { createImportsConvertedFromGifts } = require('../../middleware/import-middleware')

const importRouter = require('express').Router()

importRouter.post('/converted-gifts',
    verifyCookie, 
    decodeSessionToken,
    gymLeaderOnly,
    createImportsConvertedFromGifts,
    (req, res, next) => {
        res.status(201).json(req.ids)
})

module.exports = importRouter
