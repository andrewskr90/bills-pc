const { v4: uuidV4 } = require('uuid')
const Import = require('../models/Import')

const createImports = async (req, res, next) => {
    try {
        const collectedItemIds = await Import.create(req.body, req.claims.user_id)
        req.results = { message: "Created.", data: { collectedItemIds } }
        next()
    } catch (err) {
        return next(err)
    }
}
const createImportsConvertedFromGifts = async (req, res, next) => {
    try {
        const formattedImports = req.body.map(importToFormat => ({ id: uuidV4(), ...importToFormat }))
        req.ids = await Import.createConvertedFromGift(formattedImports)
        next()
    } catch (err) {
        next(err)
    }
}

module.exports = { createImports, createImportsConvertedFromGifts }
