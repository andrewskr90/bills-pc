const router = require('express').Router()
const VendorLocation = require('../models/vendor-location-model')
const { sanitizeObjectStrings, gymLeaderAuthorized } = require('../middlewares/universal-middleware')

router.post('/', gymLeaderAuthorized, sanitizeObjectStrings, async (req, res, next) => {
    try {
        const addedVendorLocation = await VendorLocation.add(req.body)
        res.status(201).json(addedVendorLocation)
    } catch (err) {
        next(err)
    }
})

router.get('/', async (req, res, next) => {
    try {
        const vendorLocations = await VendorLocation.find()
        res.status(200).json(vendorLocations)
    } catch (err) {
        next(err)
    }
})

router.get('/:id', async (req, res, next) => {
    const vendorLocation_id = req.params.id
    try {
        const vendorLocation = await VendorLocation.findById(vendorLocation_id)
        res.status(200).json(vendorLocation)
    } catch (err) {
        next(err)
    }
})

router.put('/:id', gymLeaderAuthorized, sanitizeObjectStrings, async (req, res, next) => {
    const vendorLocation_id = req.params.id
    const changes = req.body
    try {
        const updatedVendorLocation = await VendorLocation.update(vendorLocation_id, changes)
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
        const deletedVendorLocation = await VendorLocation.remove(vendorLocation_id)
        res.status(200).json(deletedVendorLocation)
    } catch (err) {
        next(err)
    }
})

 module.exports = router
