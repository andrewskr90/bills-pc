const saleRouter = require('express').Router()
const { decodeSessionToken, verifyCookie } = require('../../middleware/auth-middleware')
const { createSale, formatSaleResults } = require('../../middleware/sale-middleware')
const Sale = require('../../models/Sale')

saleRouter.get('/', 
    verifyCookie,
    decodeSessionToken,
    Sale.findByUserId,
    formatSaleResults,
    (req, res) => {
        const results = req.results
        res.status(200).json(results)
})

saleRouter.post('/', 
    verifyCookie,
    decodeSessionToken,
    createSale,
    (req, res) => {
        const results = req.results
        res.status(201).json(results)
})

module.exports = saleRouter
