const QueryFormatters = require('../../../utils/queryFormatters')

const insert = (req, res, next) => {
    const cards = req.cards
    const query = QueryFormatters.objectsToInsert(cards, 'cards_v2')
    req.queryQueue.push({ query, variables: [] })
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
    req.queryQueue.push({ query, variables: [] })
    next()
}

module.exports = {
    insert,
    select
}
