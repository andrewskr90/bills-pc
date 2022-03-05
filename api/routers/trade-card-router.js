const router = require('express').Router()
const TradeCard = require('../models/trade-card-model')
const { sanitizeObjectStrings, gymLeaderAuthorized } = require('../middlewares/universal-middleware')

router.post('/', gymLeaderAuthorized, sanitizeObjectStrings, async (req, res, next) => {
    try {
        const addedTradeCard = await TradeCard.add(req.body)
        res.status(201).json(addedTradeCard)
    } catch (err) {
        next(err)
    }
})

router.get('/', async (req, res, next) => {
    try {
        const tradeCards = await TradeCard.find()
        res.status(200).json(tradeCards)
    } catch (err) {
        next(err)
    }
})

router.get('/:id', async (req, res, next) => {
    const trade_card_id = req.params.id
    try {
        const tradeCard = await TradeCard.findById(trade_card_id)
        res.status(200).json(tradeCard)
    } catch (err) {
        next(err)
    }
})

router.put('/:id', gymLeaderAuthorized, async (req, res, next) => {
    const trade_card_id = req.params.id
    const changes = req.body
    try {
        const updatedTradeCard = await TradeCard.update(trade_card_id, changes)
        res.status(200).json(
            updatedTradeCard
        )
    } catch (err) {
        next(err)
    }
})

router.delete('/:id', gymLeaderAuthorized, async (req, res, next) => {
    const trade_card_id = req.params.id
    try {
        const deletedTradeCard = await TradeCard.remove(trade_card_id)
        res.status(200).json(deletedTradeCard)
    } catch (err) {
        next(err)
    }
})

 module.exports = router
 