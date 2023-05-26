const QueryFormatters = require('../../../utils/queryFormatters')

const insert = (req, res, next) => {
    const collectedProductNotes = req.collectedProductNotes
    if (collectedProductNotes.length > 0) {
        const query = QueryFormatters.objectsToInsert(collectedProductNotes, 'collected_product_notes')
    req.queryQueue.push(`${query};`)
    }
    next()
}

module.exports = {
    insert
}
