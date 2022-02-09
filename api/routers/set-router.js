const router = require('express').Router()
const SetModel = require('../models/set-model')
const { verifySet } = require('../middlewares/set-middleware')
const { sanitizeObjectStrings } = require('../middlewares/universal-middleware')

router.post('/', sanitizeObjectStrings, verifySet, async (req, res, next) => {
    try {
        const addedSet = await SetModel.add(req.body)
        res.status(201).json(addedSet)
    } catch (err) {
        next(err)
    }
})

router.get('/', async (req, res, next) => {
    try {
        const sets = await SetModel.find()
        res.status(200).json(sets)
    } catch (err) {
        next(err)
    }
})

router.get('/:id', async (req, res, next) => {
    const set_id = req.params.id
    try {
        const set = await SetModel.findById(set_id)
        res.status(200).json(set)
    } catch (err) {
        next(err)
    }
})

router.put('/:id', verifySet, async (req, res, next) => {
    const set_id = req.params.id
    const changes = req.body
    try {
        const updatedSet = await SetModel.update(set_id, changes)
        res.status(200).json(
            updatedSet
        )
    } catch (err) {
        next(err)
    }
})

router.delete('/:id', async (req, res, next) => {
    const set_id = req.params.id
    try {
        const deletedSet = await SetModel.remove(set_id)
        res.status(200).json(deletedSet)
    } catch (err) {
        next(err)
    }
})
 module.exports = router