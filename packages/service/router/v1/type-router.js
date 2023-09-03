const typeRouter = require('express').Router()
const Type = require('../../models/Type')

const { verifyCookie, decodeSessionToken, gymLeaderOnly } = require('../../middleware/auth-middleware')

typeRouter.get('/', 
    async (req, res, next) => {
        try {
            const results = await Type.find()
            res.status(200).json(results)
        } catch (err) {
            next(err)
        }
    }
)

typeRouter.post('/', 
    verifyCookie,
    decodeSessionToken,
    gymLeaderOnly,
    async (req, res, next) => {
        try {
            const results = await Type.create(req.body)
            res.status(201).json(results)
        } catch (err) {
            next(err)
        }
    }
)

typeRouter.put(`/:typeId`, 
    verifyCookie,
    decodeSessionToken,
    gymLeaderOnly,
    async (req, res, next) => {
        try {
            const results = await Type.update(req.body, req.params.typeId)
            res.status(200).json(results)
        } catch (err) {
            next(err)
        }
    }
)

typeRouter.delete(`/:typeId`, 
    verifyCookie,
    decodeSessionToken,
    gymLeaderOnly,
    async (req, res, next) => {
        try {
            const results = await Type.destroy(req.params.typeId)
            res.status(200).json(results)
        } catch (err) {
            next(err)
        }
    }
)

module.exports = typeRouter
