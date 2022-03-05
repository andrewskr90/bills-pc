const router = require('express').Router()
const VendorLocationModel = require('../models/vendor-location-model')
const { sanitizeObjectStrings, gymLeaderAuthorized } = require('../middlewares/universal-middleware')

router.post('/', gymLeaderAuthorized, sanitizeObjectStrings, async (req, res, next) => {
    try {
        const addedVendorLocation = await VendorLocationModel.add(req.body)
        res.status(201).json(addedVendorLocation)
    } catch (err) {
        next(err)
    }
})

router.get('/', async (req, res, next) => {
    try {
        const vendorLocations = await VendorLocationModel.find()
        res.status(200).json(vendorLocations)
    } catch (err) {
        next(err)
    }
})

router.get('/:id', async (req, res, next) => {
    const vendorLocation_id = req.params.id
    try {
        const vendorLocation = await VendorLocationModel.findById(vendorLocation_id)
        res.status(200).json(vendorLocation)
    } catch (err) {
        next(err)
    }
})

router.put('/:id', gymLeaderAuthorized, sanitizeObjectStrings, async (req, res, next) => {
    const vendorLocation_id = req.params.id
    const changes = req.body
    try {
        const updatedVendorLocation = await VendorLocationModel.update(vendorLocation_id, changes)
        res.status(200).json(
            updatedVendorLocation
        )
    } catch (err) {
        next(err)
    }
})

router.delete('/:id', gymLeaderAuthorized, async (req, res, next) => {
    const vendorLocation_id = req.params.id
    try {
        const deletedVendorLocation = await VendorLocationModel.remove(vendorLocation_id)
        res.status(200).json(deletedVendorLocation)
    } catch (err) {
        next(err)
    }
})

 module.exports = router
