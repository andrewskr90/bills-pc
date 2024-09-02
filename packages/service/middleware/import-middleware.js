const { v4: uuidV4 } = require('uuid')
const Import = require('../models/Import')

const createImports = async (req, res, next) => {
    try {
        const formattedImports = req.body.map(importToFormat => ({ id: uuidV4(), ...importToFormat }))
        req.ids = await Import.create(formattedImports)
        next()
    } catch (err) {
        next(err)
    }
}

module.exports = { createImports }