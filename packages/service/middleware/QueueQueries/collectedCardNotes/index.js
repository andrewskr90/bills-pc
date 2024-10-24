const QueryFormatters = require('../../../utils/queryFormatters')

const insert = (req, res, next) => {
    const collectedCardNotes = req.collectedCardNotes
    if (collectedCardNotes.length > 0) {
        const query = QueryFormatters.objectsToInsert(collectedCardNotes, 'collected_card_notes')
        req.queryQueue.push({ query: `${query};`, variables: [] })
    }
    next()
}

module.exports = {
    insert
}
