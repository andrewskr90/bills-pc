const QueryFormatters = require('../../../utils/queryFormatters')

const insert = (req, res, next) => {
    const gifts = req.gifts
    if (gifts.length > 0) {
        const query = QueryFormatters.objectsToInsert(gifts, 'gifts')
        req.queryQueue.push(`${query};`)
    }
    next()
}

const select = (req, res, next) => {
    let query
    //if request is for specific gift_id
    if (req.query.gift_id) {
        query = `SELECT * FROM gifts 
            LEFT JOIN gift_cards ON gifts.gift_id = gift_cards.gift_card_gift_id
            LEFT JOIN collected_cards ON collected_cards.collected_card_id = gift_cards.gift_card_collected_card_id
            LEFT JOIN cards_v2 ON cards_v2.card_v2_id = collected_cards.collected_card_card_id
            LEFT JOIN gift_notes ON gift_note_gift_id = gift_id 
                WHERE gift_id='${req.query.gift_id}' 
                    AND gift_receiver_id='${req.claims.user_id}' 
                    AND (gift_note_user_id='${req.claims.user_id}' OR gift_note_user_id IS NULL);`     
    } else {
        query = `SELECT * FROM gifts
            LEFT JOIN gift_cards ON gifts.gift_id = gift_cards.gift_card_gift_id
            LEFT JOIN collected_cards ON collected_cards.collected_card_id = gift_cards.gift_card_collected_card_id
            LEFT JOIN cards_v2 ON cards_v2.card_v2_id = collected_cards.collected_card_card_id
            LEFT JOIN gift_notes ON gift_note_gift_id = gift_id`
    }
    req.queryQueue.push(query)
    next()
}

module.exports = {
    insert,
    select
}
