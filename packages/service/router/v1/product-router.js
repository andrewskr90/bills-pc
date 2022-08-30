const productRouter = require('express').Router()
const { verifyCookie, decodeSessionToken, gymLeaderOnly } = require('../../middleware/auth-middleware')
const { addProductsMySQL, getProductsBySetIdMySQL } = require('../../db/queries/productQueries')
const { generateProductIds, formatProductsFromTcgPlayerDetails } = require('../../middleware/product-middleware')

productRouter.get('/set-id/:setId', 
    verifyCookie,
    decodeSessionToken,
    getProductsBySetIdMySQL,
    (req, res, next) => {
        const results = req.results
        res.status(200).json(results)
})

productRouter.post('/',
    verifyCookie, 
    decodeSessionToken,
    gymLeaderOnly,
    generateProductIds,
    addProductsMySQL,
    (req, res, next) => {
        const results = req.results
        res.status(201).json({
            data: results
        })
})

module.exports = productRouter