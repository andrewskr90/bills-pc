const collectedCardRouter = require('express').Router()
const CollectedCard = require('../../models/CollectedCard')
const { verifyCookie, decodeSessionToken } = require('../../middleware/auth-middleware')

collectedCardRouter.get('/', 
    verifyCookie,
    decodeSessionToken,
    async (req, res, next) => {
        try {
            const results = await CollectedCard.findByUserId(req.claims.user_id)
            res.status(200).json(results)
        } catch (err) {
            next(err)
        }
    }
)

module.exports = collectedCardRouter
