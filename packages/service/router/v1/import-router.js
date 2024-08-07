const { verifyCookie, decodeSessionToken, gymLeaderOnly } = require('../../middleware/auth-middleware')
const { createImports } = require('../../middleware/import-middleware')

const importRouter = require('express').Router()

importRouter.post('/',
    verifyCookie, 
    decodeSessionToken,
    gymLeaderOnly,
    createImports,
    (req, res, next) => {
        res.status(201).json(req.ids)
})

module.exports = importRouter
