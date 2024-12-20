const QueryFormatters = require('../../../utils/queryFormatters')

const insert = (req, res, next) => {
    const saleNotes = req.saleNotes
    if (saleNotes.length > 0) {
        const query = QueryFormatters.objectsToInsert(saleNotes, 'sale_notes')
    req.queryQueue.push({ query: `${query};`, variables: [] })
    }
    next()
}

module.exports = {
    insert
}
