const QueryFormatters = require('../../../utils/queryFormatters')

const insert = (req, res, next) => {
    const giftCards = req.giftCards
    if (giftCards.length > 0) {
        const query = QueryFormatters.objectsToInsert(giftCards, 'gift_cards')
        req.queryQueue.push({ query: `${query};`, variables: [] })
    }
    next()
}

module.exports = {
    insert
}
