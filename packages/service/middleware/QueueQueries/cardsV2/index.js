const QueryFormatters = require('../../../utils/queryFormatters')

const insert = (req, res, next) => {
    const cards = req.cards
    const query = QueryFormatters.objectsToInsert(cards, 'cards_v2')
    req.queryQueue.push(query)
    next()
}

const select = (req, res, next) => {
    let query
    if (Object.keys(req.query).length > 0) {
        const filter = QueryFormatters.filterConcatinated(req.query)
        query = `SELECT * FROM cards_v2 WHERE ${filter}`
    } else {
        query = 'SELECT * FROM cards_v2 LIMIT 50'
    }
    req.queryQueue.push(query)
    next()
}

const selectBySetId = (req, res, next) => {
    const setId = req.params.setId
    const query = `SELECT * FROM cards_v2 WHERE card_v2_set_id = '${setId}'`
    req.queryQueue.push(query)
    next()
}

module.exports = {
    insert,
    select,
    selectBySetId
}
