const { verifyCookie, decodeSessionToken, gymLeaderOnly } = require('../../middleware/auth-middleware')
const { createLotEdit, patchLotEdit, selectLotEdits } = require('../../middleware/lot-edit-middleware')

const lotEditRouter = require('express').Router()

lotEditRouter.post('/', 
    verifyCookie,
    decodeSessionToken,
    createLotEdit,
    (req, res, next) => {
        res.status(201).json(req.results)
})

lotEditRouter.patch('/', 
    verifyCookie,
    decodeSessionToken,
    gymLeaderOnly,
    patchLotEdit,
    (req, res, next) => {
        res.status(200).json(req.results)
})
lotEditRouter.get('/', 
    verifyCookie,
    decodeSessionToken,
    gymLeaderOnly,
    selectLotEdits,
    (req, res) => {
        res.status(200).json(req.results)
})

module.exports = lotEditRouter