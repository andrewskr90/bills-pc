const QueryFormatters = require('../../../utils/queryFormatters')

const insert = (req, res, next) => {
    const cards = req.cards
    const query = QueryFormatters.objectsToInsert(cards, 'cards')
    req.queryQueue.push({ query, variables: [] })
    next()
}

const select = (req, res, next) => {
    const setId = req.params.setId
    const query = `SELECT * FROM cards WHERE card_set_id = ?`
    req.queryQueue.push({ query, variables: [setId] })
    next()
}

module.exports = {
    insert,
    select
}
