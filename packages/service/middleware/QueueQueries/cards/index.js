const QueryFormatters = require('../../../utils/queryFormatters')

const insert = (req, res, next) => {
    const cards = req.cards
    const query = QueryFormatters.objectsToInsert(cards, 'cards')
    req.queryQueue.push(query)
    next()
}

const select = (req, res, next) => {
    const setId = req.params.setId
    const query = `SELECT * FROM cards WHERE card_set_id = '${setId}'`
    req.queryQueue.push(query)
    next()
}

module.exports = {
    insert,
    select
}
