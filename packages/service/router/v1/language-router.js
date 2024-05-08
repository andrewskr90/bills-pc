const languageRouter = require('express').Router()
const { verifyCookie, decodeSessionToken } = require('../../middleware/auth-middleware')
const Language = require('../../models/Language')

languageRouter.get('/', 
    verifyCookie,
    decodeSessionToken,
    async (req, res, next) => {
        try {
            const results = await Language.find()
            res.status(200).json(results)
        } catch (err) {
            next(err)
        }
    }
)

module.exports = languageRouter
