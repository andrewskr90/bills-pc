const router = require('express').Router()
const Card = require('../models/card-model')
const { checkCardDatatypes } = require('../middlewares/card-middleware')

router.post('/', checkCardDatatypes, async (req, res, next) => {
    try {
        const addedCard = await Card.add(req.body)
        res.status(201).json(addedCard)
    } catch (err) {
        next(err)
    }
})

router.get('/', async (req, res, next) => {
    try {
        const cards = await Card.find()
        res.status(200).json(cards)
    } catch (err) {
        next(err)
    }
})

router.get('/:id', async (req, res, next) => {
    const card_id = req.params.id
    try {
        const card = await Card.findById(card_id)
        res.status(200).json(card)
    } catch (err) {
        next(err)
    }
})

router.put('/:id', async (req, res, next) => {
    const card_id = req.params.id
    const changes = req.body
    try {
        const updatedCard = await Card.update(card_id, changes)
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
        const deletedCard = await Card.remove(card_id)
        res.status(200).json(deletedCard)
    } catch (err) {
        next(err)
    }
})

 module.exports = router
 