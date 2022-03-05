const router = require('express').Router()
const RipCard = require('../models/rip-card-model')
const { sanitizeObjectStrings, gymLeaderAuthorized } = require('../middlewares/universal-middleware')

router.post('/', gymLeaderAuthorized, sanitizeObjectStrings, async (req, res, next) => {
    try {
        const addedRipCard = await RipCard.add(req.body)
        res.status(201).json(addedRipCard)
    } catch (err) {
        next(err)
    }
})

router.get('/', async (req, res, next) => {
    try {
        const ripCards = await RipCard.find()
        res.status(200).json(ripCards)
    } catch (err) {
        next(err)
    }
})

router.get('/:id', async (req, res, next) => {
    const rip_card_id = req.params.id
    try {
        const ripCard = await RipCard.findById(rip_card_id)
        res.status(200).json(ripCard)
    } catch (err) {
        next(err)
    }
})

router.put('/:id', gymLeaderAuthorized, async (req, res, next) => {
    const rip_card_id = req.params.id
    const changes = req.body
    try {
        const updatedRipCard = await RipCard.update(rip_card_id, changes)
        res.status(200).json(
            updatedRipCard
        )
    } catch (err) {
        next(err)
    }
})

router.delete('/:id', gymLeaderAuthorized, async (req, res, next) => {
    const rip_card_id = req.params.id
    try {
        const deletedRipCard = await RipCard.remove(rip_card_id)
        res.status(200).json(deletedRipCard)
    } catch (err) {
        next(err)
    }
})

 module.exports = router
 