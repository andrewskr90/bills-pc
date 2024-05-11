const { v4: uuidV4 } = require('uuid')
const SKU = require('../models/SKU')


const createSkus = async (req, res, next) => {
    const formattedSkus = req.body.map(sku => ({ id: uuidV4(), ...sku }))
    req.ids = await SKU.create(formattedSkus)
    next()
}

const getSkus = async (req, res, next) => {
    if (req.query.itemId) {
        req.results = await SKU.findBy({ itemId: req.query.itemId })
    } else {
        req.results = await SKU.find()
    }
    next()
}

module.exports = { createSkus, getSkus }