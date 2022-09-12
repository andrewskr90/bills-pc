const QueryFormatters = require('../../../utils/queryFormatters')

const insert = (req, res, next) => {
    const sales = req.sales
    const query = QueryFormatters.objectsToInsert(sales, 'sales')
    req.queryQueue.push(`${query};`)
    next()
}

const select = (req, res, next) => {
    let query
    //if request is for specific sale_id
    if (req.query.sale_id) {
        query = `SELECT * FROM sales 
            LEFT JOIN sale_cards ON sales.sale_id = sale_cards.sale_card_sale_id
            LEFT JOIN collected_cards ON collected_cards.collected_card_id = sale_cards.sale_card_collected_card_id
            LEFT JOIN cards ON cards.card_id = collected_cards.collected_card_card_id
            LEFT JOIN sale_notes ON sale_note_sale_id = sale_id 
                WHERE sale_id='${req.query.sale_id}' 
                    AND sale_purchaser_id='${req.claims.user_id}' 
                    AND (sale_note_user_id='${req.claims.user_id}' OR sale_note_user_id IS NULL);`     
    } else {
        query = `SELECT * FROM sales
            LEFT JOIN sale_cards ON sales.sale_id = sale_cards.sale_card_sale_id
            LEFT JOIN collected_cards ON collected_cards.collected_card_id = sale_cards.sale_card_collected_card_id
            LEFT JOIN cards ON cards.card_id = collected_cards.collected_card_card_id
            LEFT JOIN sale_notes ON sale_note_sale_id = sale_id`
    }
    req.queryQueue.push(query)
    next()
}

module.exports = {
    insert,
    select
}
