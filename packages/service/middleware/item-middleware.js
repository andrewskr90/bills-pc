const Item = require('../models/Item')

const createItems = async (req, res, next) => {
    req.ids = await Item.create(req.body)
    next()
}

const getItems = async (req, res, next) => {
    if (req.query.setId) {
        req.results = await Item.selectBy({ setId: req.query.setId })
    } else {
        req.results = await Item.select()
    }
    next()
}

module.exports = { createItems, getItems }