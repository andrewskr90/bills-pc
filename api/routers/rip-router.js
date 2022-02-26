const router = require('express').Router()
const Rip = require('../models/rip-model')
const { sanitizeObjectStrings, gymLeaderAuthorized } = require('../middlewares/universal-middleware')

router.post('/', gymLeaderAuthorized, sanitizeObjectStrings, async (req, res, next) => {
    try {
        const addedRip = await Rip.add(req.body)
        res.status(201).json(addedRip)
    } catch (err) {
        next(err)
    }
})

router.get('/', async (req, res, next) => {
    try {
        const rips = await Rip.find()
        res.status(200).json(rips)
    } catch (err) {
        next(err)
    }
})

router.get('/:id', async (req, res, next) => {
    const rip_id = req.params.id
    try {
        const rip = await Rip.findById(rip_id)
        res.status(200).json(rip)
    } catch (err) {
        next(err)
    }
})

router.put('/:id', gymLeaderAuthorized, async (req, res, next) => {
    const rip_id = req.params.id
    const changes = req.body
    try {
        const updatedRip = await Rip.update(rip_id, changes)
        res.status(200).json(
            updatedRip
        )
    } catch (err) {
        next(err)
    }
})

router.delete('/:id', gymLeaderAuthorized, async (req, res, next) => {
    const rip_id = req.params.id
    try {
        const deletedRip = await Rip.remove(rip_id)
        res.status(200).json(deletedRip)
    } catch (err) {
        next(err)
    }
})

 module.exports = router
 