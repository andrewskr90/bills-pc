const { verifyCookie, decodeSessionToken } = require('../../middleware/auth-middleware')
const { createProxyUser, selectProxyUsers } = require('../../middleware/proxy-user-middleware')

const proxyUserRouter = require('express').Router()

proxyUserRouter.get('/',
    verifyCookie,
    decodeSessionToken,
    selectProxyUsers,
    (req, res, next) => {
        res.status(200).json(req.results)
    }
)

proxyUserRouter.post('/', 
    verifyCookie,
    decodeSessionToken,
    createProxyUser,
    (req, res, next) => {
        try {
            res.status(201).json(req.results)
        } catch (err) {
            next(err)
        }
})

module.exports = proxyUserRouter
