const router = require('express').Router()
const ProductConnection = require('../models/product-connection-model')
const { sanitizeObjectStrings, gymLeaderAuthorized } = require('../middlewares/universal-middleware')

router.post('/', sanitizeObjectStrings, gymLeaderAuthorized, async (req, res, next) => {
    try {
        const addedProductConnection = await ProductConnection.add(req.body)
        res.status(201).json(addedProductConnection)
    } catch (err) {
        next(err)
    }
})

router.get('/', async (req, res, next) => {
    try {
        const product_connections = await ProductConnection.find()
        res.status(200).json(product_connections)
    } catch (err) {
        next(err)
    }
})

router.get('/:id', async (req, res, next) => {
    const product_connection_id = req.params.id
    try {
        const product_connection = await ProductConnection.findById(product_connection_id)
        res.status(200).json(product_connection)
    } catch (err) {
        next(err)
    }
})

router.put('/:id', gymLeaderAuthorized, async (req, res, next) => {
    const product_connection_id = req.params.id
    const changes = req.body
    try {
        const updatedProductConnection = await ProductConnection.update(product_connection_id, changes)
        res.status(200).json(
            updatedProductConnection
        )
    } catch (err) {
        next(err)
    }
})

router.delete('/:id', gymLeaderAuthorized, async (req, res, next) => {
    const product_connection_id = req.params.id
    try {
        const deletedProductConnection = await ProductConnection.remove(product_connection_id)
        res.status(200).json(deletedProductConnection)
    } catch (err) {
        next(err)
    }
})

 module.exports = router
 