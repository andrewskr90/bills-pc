const QueryFormatters = require('../../../utils/queryFormatters')

const insert = (req, res, next) => {
    const saleNotes = req.saleNotes
    if (saleNotes.length > 0) {
        const query = QueryFormatters.objectsToInsert(saleNotes, 'sale_notes')
    req.queryQueue.push(`${query};`)
    }
    next()
}

module.exports = {
    insert
}
