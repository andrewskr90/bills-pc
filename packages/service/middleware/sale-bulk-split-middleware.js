const SaleBulkSplit = require('../models/SaleBulkSplit')

const getSaleBulkSplits = async (req, res, next) => {
    try {
        req.saleBulkSplits = await SaleBulkSplit.select(req.claims.user_id)
        return next()
    } catch (err) {
        next(err)
    }
}

module.exports = {
    getSaleBulkSplits
}