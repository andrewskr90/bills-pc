const router = require('express').Router()
const Product = require('../models/product-model')
const { verifyProduct } = require('../middlewares/product-middleware')
const { sanitizeObjectStrings, gymLeaderAuthorized } = require('../middlewares/universal-middleware')

router.post('/', gymLeaderAuthorized, sanitizeObjectStrings, verifyProduct, async (req, res, next) => {
    try {
        const addedProduct = await Product.add(req.body)
        res.status(201).json(addedProduct)
    } catch (err) {
        next(err)
    }
})

router.get('/', async (req, res, next) => {
    try {
        const products = await Product.find()
        res.status(200).json(products)
    } catch (err) {
        next(err)
    }
})

router.get('/:id', async (req, res, next) => {
    const product_id = req.params.id
    try {
        const product = await Product.findById(product_id)
        res.status(200).json(product)
    } catch (err) {
        next(err)
    }
})

router.put('/:id', gymLeaderAuthorized, verifyProduct, async (req, res, next) => {
    const product_id = req.params.id
    const changes = req.body
    try {
        const updatedProduct = await Product.update(product_id, changes)
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
        const deletedProduct = await Product.remove(product_id)
        res.status(200).json(deletedProduct)
    } catch (err) {
        next(err)
    }
})

 module.exports = router
 