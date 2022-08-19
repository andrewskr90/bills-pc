const productRouter = require('express').Router()
const { verifySession, decodeJwt, gymLeaderOnly } = require('../../middleware/auth-middleware')
const { addProductsMySQL, getProductsBySetIdMySQL } = require('../../db/queries/productQueries')
const { generateProductIds, formatProductsFromTcgPlayerDetails } = require('../../middleware/product-middleware')

productRouter.get('/set-id/:setId', 
    verifySession,
    decodeJwt,
    getProductsBySetIdMySQL,
    (req, res, next) => {
        const results = req.results
        res.status(200).json(results)
})

productRouter.post('/',
    verifySession, 
    decodeJwt,
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