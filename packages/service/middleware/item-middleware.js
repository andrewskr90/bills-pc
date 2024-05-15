const Item = require('../models/Item')

const createItems = async (req, res, next) => {
    try {
        req.ids = await Item.create(req.body)
        next()
    } catch (err) {
        return next(err)
    }
}

const getItems = async (req, res, next) => {
    if (req.query.setId) {
        req.results = await Item.selectBy({ setId: req.query.setId })
    } else {
        req.results = await Item.select()
    }
    next()
}

const patchItem = async (req, res, next) => {
    if (req.query.tcgpId) {
        req.results = await Item.patchByTcgpId(req.query.tcgpId, req.body)
    } else {
        next({ status: 500, message: 'tcgpId param is not present.' })
    }
}

module.exports = { createItems, getItems, patchItem }