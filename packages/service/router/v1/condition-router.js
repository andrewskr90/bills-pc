const conditionRouter = require('express').Router()
const { verifyCookie, decodeSessionToken } = require('../../middleware/auth-middleware')
const Condition = require('../../models/Condition')


conditionRouter.get('/', 
    verifyCookie,
    decodeSessionToken,
    async (req, res, next) => {
        try {
            const results = await Condition.find()
            res.status(200).json(results)
        } catch (err) {
            next(err)
        }
    }
)

module.exports = conditionRouter
