const { verifyCookie, decodeSessionToken } = require('../../middleware/auth-middleware')
const { createLotEdit } = require('../../middleware/lot-edit-middleware')

const lotEditRouter = require('express').Router()

lotEditRouter.post('/', 
    verifyCookie,
    decodeSessionToken,
    createLotEdit,
    (req, res, next) => {
        res.status(201).json(req.results)
})

module.exports = lotEditRouter