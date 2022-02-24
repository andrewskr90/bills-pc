const router = require('express').Router()
const ProductModel = require('../models/product-model')
const { verifyProduct } = require('../middlewares/product-middleware')
const { sanitizeObjectStrings, gymLeaderAuthorized } = require('../middlewares/universal-middleware')

router.post('/', gymLeaderAuthorized, sanitizeObjectStrings, verifyProduct, async (req, res, next) => {
    try {
        const addedProduct = await ProductModel.add(req.body)
        res.status(201).json(addedProduct)
    } catch (err) {
        next(err)
    }
})

router.get('/', async (req, res, next) => {
    try {
        const products = await ProductModel.find()
        res.status(200).json(products)
    } catch (err) {
        next(err)
    }
})

router.get('/:id', async (req, res, next) => {
    const product_id = req.params.id
    try {
        const product = await ProductModel.findById(product_id)
        res.status(200).json(product)
    } catch (err) {
        next(err)
    }
})

router.put('/:id', gymLeaderAuthorized, verifyProduct, async (req, res, next) => {
    const product_id = req.params.id
    const changes = req.body
    try {
        const updatedProduct = await ProductModel.update(product_id, changes)
        res.status(200).json(
            updatedProduct
        )
    } catch (err) {
        next(err)
    }
})

router.delete('/:id', gymLeaderAuthorized, async (req, res, next) => {
    const product_id = req.params.id
    try {
        const deletedProduct = await ProductModel.remove(product_id)
        res.status(200).json(deletedProduct)
    } catch (err) {
        next(err)
    }
})

 module.exports = router
 