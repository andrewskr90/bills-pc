const router = require('express').Router()
const Trade = require('../models/trade-model')
const { sanitizeObjectStrings, gymLeaderAuthorized } = require('../middlewares/universal-middleware')

router.post('/', gymLeaderAuthorized, sanitizeObjectStrings, async (req, res, next) => {
    try {
        const addedTrade = await Trade.add(req.body)
        res.status(201).json(addedTrade)
    } catch (err) {
        next(err)
    }
})

router.get('/', async (req, res, next) => {
    try {
        const trades = await Trade.find()
        res.status(200).json(trades)
    } catch (err) {
        next(err)
    }
})

router.get('/:id', async (req, res, next) => {
    const trade_id = req.params.id
    try {
        const trade = await Trade.findById(trade_id)
        res.status(200).json(trade)
    } catch (err) {
        next(err)
    }
})

router.put('/:id', gymLeaderAuthorized, async (req, res, next) => {
    const trade_id = req.params.id
    const changes = req.body
    try {
        const updatedTrade = await Trade.update(trade_id, changes)
        res.status(200).json(
            updatedTrade
        )
    } catch (err) {
        next(err)
    }
})

router.delete('/:id', gymLeaderAuthorized, async (req, res, next) => {
    const trade_id = req.params.id
    try {
        const deletedTrade = await Trade.remove(trade_id)
        res.status(200).json(deletedTrade)
    } catch (err) {
        next(err)
    }
})

 module.exports = router
 