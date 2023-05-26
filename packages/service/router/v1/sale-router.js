const saleRouter = require('express').Router()
const { decodeSessionToken, verifyCookie } = require('../../middleware/auth-middleware')
const Sale = require('../../models/Sale')

saleRouter.get('/', 
        verifyCookie,
    decodeSessionToken,
    Sale.findByUserId,
    (req, res, next) => {
        const results = req.sales
        res.status(200).json(results)
})

module.exports = saleRouter
