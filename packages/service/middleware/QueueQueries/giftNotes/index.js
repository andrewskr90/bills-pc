const QueryFormatters = require('../../../utils/queryFormatters')

const insert = (req, res, next) => {
    const giftNotes = req.giftNotes
    if (giftNotes.length > 0) {
        const query = QueryFormatters.objectsToInsert(giftNotes, 'gift_notes')
        req.queryQueue.push(`${query};`)
    }
    next()
}

module.exports = {
    insert
}
