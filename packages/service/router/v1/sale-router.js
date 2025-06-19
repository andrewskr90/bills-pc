const saleRouter = require('express').Router()
const { decodeSessionToken, verifyCookie } = require('../../middleware/auth-middleware')
const { createSale } = require('../../middleware/sale-middleware')

saleRouter.post('/', 
    verifyCookie,
    decodeSessionToken,
    createSale,
    (req, res) => {
        const results = req.results
        res.status(201).json(results)
})

module.exports = saleRouter
