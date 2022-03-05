const router = require('express').Router()
const Sale = require('../models/sale-model')
const { sanitizeObjectStrings, gymLeaderAuthorized } = require('../middlewares/universal-middleware')

router.post('/', gymLeaderAuthorized, sanitizeObjectStrings, async (req, res, next) => {
    try {
        const addedSale = await Sale.add(req.body)
        res.status(201).json(addedSale)
    } catch (err) {
        next(err)
    }
})

router.get('/', async (req, res, next) => {
    try {
        const sales = await Sale.find()
        res.status(200).json(sales)
    } catch (err) {
        next(err)
    }
})

router.get('/:id', async (req, res, next) => {
    const sale_id = req.params.id
    try {
        const sale = await Sale.findById(sale_id)
        res.status(200).json(sale)
    } catch (err) {
        next(err)
    }
})

router.put('/:id', gymLeaderAuthorized, async (req, res, next) => {
    const sale_id = req.params.id
    const changes = req.body
    try {
        const updatedSale = await Sale.update(sale_id, changes)
        res.status(200).json(
            updatedSale
        )
    } catch (err) {
        next(err)
    }
})

router.delete('/:id', gymLeaderAuthorized, async (req, res, next) => {
    const sale_id = req.params.id
    try {
        const deletedSale = await Sale.remove(sale_id)
        res.status(200).json(deletedSale)
    } catch (err) {
        next(err)
    }
})

 module.exports = router
 