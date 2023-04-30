const collectedProductRouter = require('express').Router()
const CollectedProduct = require('../../models/CollectedProduct')

const { verifyCookie, decodeSessionToken } = require('../../middleware/auth-middleware')

collectedProductRouter.get('/', 
    verifyCookie,
    decodeSessionToken,
    async (req, res, next) => {
        try {
            const results = await CollectedProduct.findByUserId()
            res.status(200).json(results)
        } catch (err) {
            next(err)
        }
    }
)

module.exports = collectedProductRouter
