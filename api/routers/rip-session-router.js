const router = require('express').Router()
const RipSessionModel = require('../models/rip-session-model')
const { sanitizeObjectStrings, gymLeaderAuthorized } = require('../middlewares/universal-middleware')

router.post('/', gymLeaderAuthorized, sanitizeObjectStrings, async (req, res, next) => {
    try {
        const addedRipSession = await RipSessionModel.add(req.body)
        res.status(201).json(addedRipSession)
    } catch (err) {
        next(err)
    }
})

router.get('/', async (req, res, next) => {
    try {
        const ripSessions = await RipSessionModel.find()
        res.status(200).json(ripSessions)
    } catch (err) {
        next(err)
    }
})

router.get('/:id', async (req, res, next) => {
    const ripSession_id = req.params.id
    try {
        const ripSession = await RipSessionModel.findById(ripSession_id)
        res.status(200).json(ripSession)
    } catch (err) {
        next(err)
    }
})

router.put('/:id', gymLeaderAuthorized, async (req, res, next) => {
    const ripSession_id = req.params.id
    const changes = req.body
    try {
        const updatedRipSession = await RipSessionModel.update(ripSession_id, changes)
        res.status(200).json(
            updatedRipSession
        )
    } catch (err) {
        next(err)
    }
})

router.delete('/:id', gymLeaderAuthorized, async (req, res, next) => {
    const ripSession_id = req.params.id
    try {
        const deletedRipSession = await RipSessionModel.remove(ripSession_id)
        res.status(200).json(deletedRipSession)
    } catch (err) {
        next(err)
    }
})

 module.exports = router