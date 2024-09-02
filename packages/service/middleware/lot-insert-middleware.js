const LotInsert = require('../models/LotInsert')

const selectLotInserts = async (req, res, next) => {
    if (req.query.lotEditId) {
        const lotEditId = req.query.lotEditId
        req.results = await LotInsert.selectByFilter({ lotEditId })
        next()
    } else {
        next({ status: 500, message: 'no such route.' })
    }
}

module.exports = { selectLotInserts }
