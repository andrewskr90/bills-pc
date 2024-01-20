const QueryFormatters = require('../../../utils/queryFormatters')

const insert = (req, res, next) => {
    const giftBulkSplits = req.giftBulkSplits
    if (giftBulkSplits.length > 0) {
        const query = QueryFormatters.objectsToInsert(giftBulkSplits, 'gift_bulk_splits')
        req.queryQueue.push(`${query};`)
    }
    next()
}

module.exports = {
    insert
}
