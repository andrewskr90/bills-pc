const router = require('express').Router()
const SaleCard = require('../models/sale-card-model')
const { sanitizeObjectStrings, gymLeaderAuthorized } = require('../middlewares/universal-middleware')

router.post('/', gymLeaderAuthorized, sanitizeObjectStrings, async (req, res, next) => {
    try {
        const addedSaleCard = await SaleCard.add(req.body)
        res.status(201).json(addedSaleCard)
    } catch (err) {
        next(err)
    }
})

router.get('/', async (req, res, next) => {
    try {
        const saleCards = await SaleCard.find()
        res.status(200).json(saleCards)
    } catch (err) {
        next(err)
    }
})

router.get('/:id', async (req, res, next) => {
    const sale_card_id = req.params.id
    try {
        const saleCard = await SaleCard.findById(sale_card_id)
        res.status(200).json(saleCard)
    } catch (err) {
        next(err)
    }
})

router.put('/:id', gymLeaderAuthorized, async (req, res, next) => {
    const sale_card_id = req.params.id
    const changes = req.body
    try {
        const updatedSaleCard = await SaleCard.update(sale_card_id, changes)
        res.status(200).json(
            updatedSaleCard
        )
    } catch (err) {
        next(err)
    }
})

router.delete('/:id', gymLeaderAuthorized, async (req, res, next) => {
    const sale_card_id = req.params.id
    try {
        const deletedSaleCard = await SaleCard.remove(sale_card_id)
        res.status(200).json(deletedSaleCard)
    } catch (err) {
        next(err)
    }
})

 module.exports = router
 