const router = require('express').Router()
const CollectedCard = require('../models/collected-card-model')
const { sanitizeObjectStrings, gymLeaderAuthorized } = require('../middlewares/universal-middleware')

router.post('/', sanitizeObjectStrings, gymLeaderAuthorized, async (req, res, next) => {
    try {
        const addedCollectedCard = await CollectedCard.add(req.body)
        res.status(201).json(addedCollectedCard)
    } catch (err) {
        next(err)
    }
})

router.get('/', async (req, res, next) => {
    try {
        const collectedCards = await CollectedCard.find()
        res.status(200).json(collectedCards)
    } catch (err) {
        next(err)
    }
})

router.get('/:id', async (req, res, next) => {
    const collected_card_id = req.params.id
    try {
        const collectedCard = await CollectedCard.findById(collected_card_id)
        res.status(200).json(collectedCard)
    } catch (err) {
        next(err)
    }
})

router.put('/:id', gymLeaderAuthorized, async (req, res, next) => {
    const collected_card_id = req.params.id
    const changes = req.body
    try {
        const updatedCollectedCard = await CollectedCard.update(collected_card_id, changes)
        res.status(200).json(
            updatedCollectedCard
        )
    } catch (err) {
        next(err)
    }
})

router.delete('/:id', gymLeaderAuthorized, async (req, res, next) => {
    const collected_card_id = req.params.id
    try {
        const deletedCollectedCard = await CollectedCard.remove(collected_card_id)
        res.status(200).json(deletedCollectedCard)
    } catch (err) {
        next(err)
    }
})

 module.exports = router
 