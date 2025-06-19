const QueryFormatters = require('../../../utils/queryFormatters')

const insert = (req, res, next) => {
    const saleCards = req.saleCards
    if (saleCards.length > 0) {
        const query = QueryFormatters.objectsToInsert(saleCards, 'sale_cards')
        req.queryQueue.push({ query: `${query};`, variables: [] })
    }
    next()
}

module.exports = {
    insert
}
