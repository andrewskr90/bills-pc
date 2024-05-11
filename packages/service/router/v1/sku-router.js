const { verifyCookie, decodeSessionToken, gymLeaderOnly } = require('../../middleware/auth-middleware')
const { createSkus, getSkus } = require('../../middleware/sku-middleware')

const skuRouter = require('express').Router()

skuRouter.post('/',
    verifyCookie, 
    decodeSessionToken,
    gymLeaderOnly,
    createSkus,
    (req, res, next) => {
        res.status(201).json(req.ids)
})

skuRouter.get('/', 
    verifyCookie,
    decodeSessionToken,
    getSkus,
    (req, res, next) => {
        res.status(200).json(req.results)
})

module.exports = skuRouter
