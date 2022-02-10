const router = require('express').Router()
const CardModel = require('../models/card-model')
const { verifyCard } = require('../middlewares/card-middleware')
const { sanitizeObjectStrings } = require('../middlewares/universal-middleware')

router.post('/', sanitizeObjectStrings, verifyCard, async (req, res, next) => {
    try {
        const addedCard = await CardModel.add(req.body)
        res.status(201).json(addedCard)
    } catch (err) {
        next(err)
    }
})

router.get('/', async (req, res, next) => {
    try {
        const cards = await CardModel.find()
        res.status(200).json(cards)
    } catch (err) {
        next(err)
    }
})

router.get('/:id', async (req, res, next) => {
    const card_id = req.params.id
    try {
        const card = await CardModel.findById(card_id)
        res.status(200).json(card)
    } catch (err) {
        next(err)
    }
})

router.put('/:id', verifyCard, async (req, res, next) => {
    const card_id = req.params.id
    const changes = req.body
    try {
        const updatedCard = await CardModel.update(card_id, changes)
        res.status(200).json(
            updatedCard
        )
    } catch (err) {
        next(err)
    }
})

router.delete('/:id', async (req, res, next) => {
    const card_id = req.params.id
    try {
        const deletedCard = await CardModel.remove(card_id)
        res.status(200).json(deletedCard)
    } catch (err) {
        next(err)
    }
})
 module.exports = router