const QueryFormatters = require('../../../utils/queryFormatters')

const insert = (req, res, next) => {
    const collectedCardNotes = req.collectedCardNotes
    if (collectedCardNotes.length > 0) {
        const query = QueryFormatters.objectsToInsert(collectedCardNotes, 'collected_card_notes')
    req.queryQueue.push(`${query};`)
    }
    next()
}

const select = (req, res, next) => {
    // req.query.collected_card_user_id = req.claims.user_id
    // let whereClause = `WHERE ${QueryFormatters.filterConcatinated(req.query)}`
    // let queryString = `SELECT * FROM cards 
    //     RIGHT JOIN collected_cards ON cards.card_id = collected_cards.collected_card_card_id
    //     LEFT JOIN sets ON cards.card_set_id = sets.set_id 
    //     LEFT JOIN sale_cards ON sale_cards.sale_card_collected_card_id = collected_card_id 
    //     LEFT JOIN collected_card_notes ON collected_card_note_collected_card_id = collected_card_id
    //     ${whereClause}`
    // req.queryQueue.push(queryString)
    // next()
}

module.exports = {
    insert,
    select
}
