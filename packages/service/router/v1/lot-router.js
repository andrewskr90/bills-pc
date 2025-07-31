const { verifyCookie, decodeSessionToken } = require('../../middleware/auth-middleware')
const { getLotById } = require('../../middleware/lot-middleware')

const lotRouter = require('express').Router()

lotRouter.get('/:id',
    verifyCookie,
    decodeSessionToken,
    getLotById,
    (req, res, next) => {
        res.status(200).json(req.results)
})

module.exports = lotRouter
