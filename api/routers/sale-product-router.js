const router = require('express').Router()
const SaleProduct = require('../models/sale-product-model')
const { sanitizeObjectStrings, gymLeaderAuthorized } = require('../middlewares/universal-middleware')

router.post('/', gymLeaderAuthorized, sanitizeObjectStrings, async (req, res, next) => {
    try {
        const addedSaleProduct = await SaleProduct.add(req.body)
        res.status(201).json(addedSaleProduct)
    } catch (err) {
        next(err)
    }
})

router.get('/', async (req, res, next) => {
    try {
        const saleProducts = await SaleProduct.find()
        res.status(200).json(saleProducts)
    } catch (err) {
        next(err)
    }
})

router.get('/:id', async (req, res, next) => {
    const sale_product_id = req.params.id
    try {
        const saleProduct = await SaleProduct.findById(sale_product_id)
        res.status(200).json(saleProduct)
    } catch (err) {
        next(err)
    }
})

router.put('/:id', gymLeaderAuthorized, async (req, res, next) => {
    const sale_product_id = req.params.id
    const changes = req.body
    try {
        const updatedSaleProduct = await SaleProduct.update(sale_product_id, changes)
        res.status(200).json(
            updatedSaleProduct
        )
    } catch (err) {
        next(err)
    }
})

router.delete('/:id', gymLeaderAuthorized, async (req, res, next) => {
    const sale_product_id = req.params.id
    try {
        const deletedSaleProduct = await SaleProduct.remove(sale_product_id)
        res.status(200).json(deletedSaleProduct)
    } catch (err) {
        next(err)
    }
})

 module.exports = router
 