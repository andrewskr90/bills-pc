const rarityRouter = require('express').Router()
const Rarity = require('../../models/Rarity')

const { verifyCookie, decodeSessionToken, gymLeaderOnly } = require('../../middleware/auth-middleware')

rarityRouter.get('/', 
    async (req, res, next) => {
        try {
            const results = await Rarity.find()
            res.status(200).json(results)
        } catch (err) {
            next(err)
        }
    }
)

rarityRouter.post('/', 
    verifyCookie,
    decodeSessionToken,
    gymLeaderOnly,
    async (req, res, next) => {
        try {
            const results = await Rarity.create(req.body)
            res.status(201).json(results)
        } catch (err) {
            next(err)
        }
    }
)

rarityRouter.put(`/:rarityId`, 
    verifyCookie,
    decodeSessionToken,
    gymLeaderOnly,
    async (req, res, next) => {
        try {
            const results = await Rarity.update(req.body, req.params.rarityId)
            res.status(200).json(results)
        } catch (err) {
            next(err)
        }
    }
)

rarityRouter.delete(`/:rarityId`, 
    verifyCookie,
    decodeSessionToken,
    gymLeaderOnly,
    async (req, res, next) => {
        try {
            const results = await Rarity.destroy(req.params.rarityId)
            res.status(200).json(results)
        } catch (err) {
            next(err)
        }
    }
)

module.exports = rarityRouter
