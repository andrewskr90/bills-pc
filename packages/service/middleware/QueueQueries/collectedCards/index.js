const QueryFormatters = require('../../../utils/queryFormatters')

const insert = (req, res, next) => {
    const collectedCards = req.collectedCards
    if (collectedCards.length > 0) {
        const query = QueryFormatters.objectsToInsert(collectedCards, 'collected_cards')
        req.queryQueue.push({ query: `${query};`, variables: [] })
    }
    next()
}

const select = (req, res, next) => {
    req.query.collected_card_user_id = req.claims.user_id
    let whereClause = `WHERE ${QueryFormatters.filterConcatinated(req.query)}`
    let query = `SELECT * FROM cards_v2 
        RIGHT JOIN collected_cards ON cards_v2.card_v2_id = collected_cards.collected_card_card_id
        LEFT JOIN sets_v2 ON cards_v2.card_v2_set_id = sets_v2.set_v2_id 
        LEFT JOIN sale_cards ON sale_cards.sale_card_collected_card_id = collected_card_id 
        LEFT JOIN collected_card_notes ON collected_card_note_collected_card_id = collected_card_id
        ${whereClause}`
    req.queryQueue.push({ query, variables: [] })
    next()
}

module.exports = {
    insert,
    select
}
