const productRouter = require('express').Router()
const { verifyCookie, decodeSessionToken, gymLeaderOnly } = require('../../middleware/auth-middleware')
const { addProductsMySQL, getProductsBySetIdMySQL } = require('../../db/queries/productQueries')
const { generateProductIds, formatProductsFromTcgPlayerDetails } = require('../../middleware/product-middleware')
const QueueQueries = require('../../middleware/QueueQueries')
const { executeQueries } = require('../../db')

productRouter.get('/',
    verifyCookie,
    decodeSessionToken,
    QueueQueries.init,
    QueueQueries.products.select,
    executeQueries,
    (req, res, next) => {
        const results = req.results
        res.status(200).json(results)
})

productRouter.post('/',
    verifyCookie, 
    decodeSessionToken,
    gymLeaderOnly,
    generateProductIds,
    QueueQueries.init,
    QueueQueries.products.insert,
    executeQueries,
    (req, res, next) => {
        const results = req.results
        res.status(201).json({
            data: results
        })
})

module.exports = productRouter