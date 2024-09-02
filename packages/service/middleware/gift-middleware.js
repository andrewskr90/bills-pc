const Gift = require('../models/Gift')

const patchGift = async (req, res, next) => {
    if (req.query.collectedItemId) {
        const collectedItemId = req.query.collectedItemId
        req.results = await Gift.patchByFilter({ collectedItemId }, req.body)
        next()
    } else if (req.query.lotId) {
        const lotId = req.query.lotId
        req.results = await Gift.patchByFilter({ lotId }, req.body)
        next()
    } else {
        next({ status: 500, message: 'collectedItemId or lotId param is not present.' })
    }
}

const selectGifts = async (req, res, next) => {
    if (req.query.lotId) {
        const lotId = req.query.lotId
        req.results = await Gift.selectByFilter({ lotId })
        next()
    } else if (req.query.collectedItemId) {
        const collectedItemId = req.query.collectedItemId
        req.results = await Gift.selectByFilter({ collectedItemId })
        next()
    } else {
        next({ status: 500, message: 'no such route.' })
    }
}

const deleteGiftById = async (req, res, next) => {
    const giftId = req.params.id
    req.results = await Gift.deleteById(giftId)
    next()
}

module.exports = { patchGift, selectGifts, deleteGiftById }