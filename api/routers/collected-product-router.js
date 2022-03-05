const router = require('express').Router()
const CollectedProduct = require('../models/collectedProduct-model')
const { sanitizeObjectStrings, gymLeaderAuthorized } = require('../middlewares/universal-middleware')

router.post('/', gymLeaderAuthorized, sanitizeObjectStrings, async (req, res, next) => {
    try {
        const addedCollectedProduct = await CollectedProduct.add(req.body)
        res.status(201).json(addedCollectedProduct)
    } catch (err) {
        next(err)
    }
})

router.get('/', async (req, res, next) => {
    try {
        const collectedProducts = await CollectedProduct.find()
        res.status(200).json(collectedProducts)
    } catch (err) {
        next(err)
    }
})

router.get('/:id', async (req, res, next) => {
    const collected_product_id = req.params.id
    try {
        const collectedProduct = await CollectedProduct.findById(collected_product_id)
        res.status(200).json(collectedProduct)
    } catch (err) {
        next(err)
    }
})

router.put('/:id', gymLeaderAuthorized, async (req, res, next) => {
    const collected_product_id = req.params.id
    const changes = req.body
    try {
        const updatedCollectedProduct = await CollectedProduct.update(collected_product_id, changes)
        res.status(200).json(
            updatedCollectedProduct
        )
    } catch (err) {
        next(err)
    }
})

router.delete('/:id', gymLeaderAuthorized, async (req, res, next) => {
    const collected_product_id = req.params.id
    try {
        const deletedCollectedProduct = await CollectedProduct.remove(collected_product_id)
        res.status(200).json(deletedCollectedProduct)
    } catch (err) {
        next(err)
    }
})

 module.exports = router
 