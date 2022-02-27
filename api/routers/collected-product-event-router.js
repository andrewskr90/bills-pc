const router = require('express').Router()
const CollectedProductEvent = require('../models/collected-product-event-model')
const { sanitizeObjectStrings, gymLeaderAuthorized } = require('../middlewares/universal-middleware')

router.post('/', gymLeaderAuthorized, sanitizeObjectStrings, async (req, res, next) => {
    try {
        const addedCollectedProductEvent = await CollectedProductEvent.add(req.body)
        res.status(201).json(addedCollectedProductEvent)
    } catch (err) {
        next(err)
    }
})

router.get('/', async (req, res, next) => {
    try {
        const collectedProductEvents = await CollectedProductEvent.find()
        res.status(200).json(collectedProductEvents)
    } catch (err) {
        next(err)
    }
})

router.get('/:id', async (req, res, next) => {
    const collected_product_event_id = req.params.id
    try {
        const collectedProductEvent = await CollectedProductEvent.findById(collected_product_event_id)
        res.status(200).json(collectedProductEvent)
    } catch (err) {
        next(err)
    }
})

router.put('/:id', gymLeaderAuthorized, async (req, res, next) => {
    const collected_product_event_id = req.params.id
    const changes = req.body
    try {
        const updatedCollectedProductEvent = await CollectedProductEvent.update(collected_product_event_id, changes)
        res.status(200).json(
            updatedCollectedProductEvent
        )
    } catch (err) {
        next(err)
    }
})

router.delete('/:id', gymLeaderAuthorized, async (req, res, next) => {
    const collected_product_event_id = req.params.id
    try {
        const deletedCollectedProductEvent = await CollectedProductEvent.remove(collected_product_event_id)
        res.status(200).json(deletedCollectedProductEvent)
    } catch (err) {
        next(err)
    }
})

 module.exports = router
 