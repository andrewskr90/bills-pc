const router = require('express').Router()
const RipProduct = require('../models/rip-product-model')
const { sanitizeObjectStrings, gymLeaderAuthorized } = require('../middlewares/universal-middleware')

router.post('/', gymLeaderAuthorized, sanitizeObjectStrings, async (req, res, next) => {
    try {
        const addedRipProduct = await RipProduct.add(req.body)
        res.status(201).json(addedRipProduct)
    } catch (err) {
        next(err)
    }
})

router.get('/', async (req, res, next) => {
    try {
        const ripProducts = await RipProduct.find()
        res.status(200).json(ripProducts)
    } catch (err) {
        next(err)
    }
})

router.get('/:id', async (req, res, next) => {
    const rip_product_id = req.params.id
    try {
        const ripProduct = await RipProduct.findById(rip_product_id)
        res.status(200).json(ripProduct)
    } catch (err) {
        next(err)
    }
})

router.put('/:id', gymLeaderAuthorized, async (req, res, next) => {
    const rip_product_id = req.params.id
    const changes = req.body
    try {
        const updatedRipProduct = await RipProduct.update(rip_product_id, changes)
        res.status(200).json(
            updatedRipProduct
        )
    } catch (err) {
        next(err)
    }
})

router.delete('/:id', gymLeaderAuthorized, async (req, res, next) => {
    const rip_product_id = req.params.id
    try {
        const deletedRipProduct = await RipProduct.remove(rip_product_id)
        res.status(200).json(deletedRipProduct)
    } catch (err) {
        next(err)
    }
})

 module.exports = router
 