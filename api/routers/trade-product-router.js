const router = require('express').Router()
const TradeProduct = require('../models/trade-product-model')
const { sanitizeObjectStrings, gymLeaderAuthorized } = require('../middlewares/universal-middleware')

router.post('/', gymLeaderAuthorized, sanitizeObjectStrings, async (req, res, next) => {
    try {
        const addedTradeProduct = await TradeProduct.add(req.body)
        res.status(201).json(addedTradeProduct)
    } catch (err) {
        next(err)
    }
})

router.get('/', async (req, res, next) => {
    try {
        const tradeProducts = await TradeProduct.find()
        res.status(200).json(tradeProducts)
    } catch (err) {
        next(err)
    }
})

router.get('/:id', async (req, res, next) => {
    const trade_product_id = req.params.id
    try {
        const tradeProduct = await TradeProduct.findById(trade_product_id)
        res.status(200).json(tradeProduct)
    } catch (err) {
        next(err)
    }
})

router.put('/:id', gymLeaderAuthorized, async (req, res, next) => {
    const trade_product_id = req.params.id
    const changes = req.body
    try {
        const updatedTradeProduct = await TradeProduct.update(trade_product_id, changes)
        res.status(200).json(
            updatedTradeProduct
        )
    } catch (err) {
        next(err)
    }
})

router.delete('/:id', gymLeaderAuthorized, async (req, res, next) => {
    const trade_product_id = req.params.id
    try {
        const deletedTradeProduct = await TradeProduct.remove(trade_product_id)
        res.status(200).json(deletedTradeProduct)
    } catch (err) {
        next(err)
    }
})

 module.exports = router
 