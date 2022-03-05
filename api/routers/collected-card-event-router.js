const router = require('express').Router()
const CollectedCardEvent = require('../models/collected-card-event-model')
const { sanitizeObjectStrings, gymLeaderAuthorized } = require('../middlewares/universal-middleware')

router.post('/', sanitizeObjectStrings, gymLeaderAuthorized, async (req, res, next) => {
    try {
        const addedCollectedCardEvent = await CollectedCardEvent.add(req.body)
        res.status(201).json(addedCollectedCardEvent)
    } catch (err) {
        next(err)
    }
})

router.get('/', async (req, res, next) => {
    try {
        const collectedCardEvents = await CollectedCardEvent.find()
        res.status(200).json(collectedCardEvents)
    } catch (err) {
        next(err)
    }
})

router.get('/:id', async (req, res, next) => {
    const collected_card_event_id = req.params.id
    try {
        const collectedCardEvent = await CollectedCardEvent.findById(collected_card_event_id)
        res.status(200).json(collectedCardEvent)
    } catch (err) {
        next(err)
    }
})

router.put('/:id', gymLeaderAuthorized, async (req, res, next) => {
    const collected_card_event_id = req.params.id
    const changes = req.body
    try {
        const updatedCollectedCardEvent = await CollectedCardEvent.update(collected_card_event_id, changes)
        res.status(200).json(
            updatedCollectedCardEvent
        )
    } catch (err) {
        next(err)
    }
})

router.delete('/:id', gymLeaderAuthorized, async (req, res, next) => {
    const collected_card_event_id = req.params.id
    try {
        const deletedCollectedCardEvent = await CollectedCardEvent.remove(collected_card_event_id)
        res.status(200).json(deletedCollectedCardEvent)
    } catch (err) {
        next(err)
    }
})

 module.exports = router
 