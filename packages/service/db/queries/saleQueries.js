const connection = require('..')
const QueryFormatters = require('../../utils/QueryFormatters')

const findSalesMySQL = async (req, res, next) => {
    const queryString = `SELECT * FROM sales 
        LEFT JOIN sale_cards ON sales.sale_id = sale_cards.sale_card_sale_id
        LEFT JOIN collected_cards ON collected_cards.collected_card_id = sale_cards.sale_card_collected_card_id
        LEFT JOIN cards ON cards.card_id = collected_cards.collected_card_card_id
        LEFT JOIN sale_notes ON sale_note_sale_id = sale_id 
            WHERE sale_id='${req.query.sale_id}' 
                AND sale_purchaser_id='${req.claims.user_id}' 
                AND (sale_note_user_id='${req.claims.user_id}' OR sale_note_user_id IS NULL);`
    const query= new Promise((resolve, reject) => {
        connection.query(queryString, (err, results) => {
            if (err) {
                reject(err)
            } else {
                resolve(results)
            }
        })
    })
    try {
        req.results = await query
        return next()
    } catch (err) {
        return next(err)
    }
}

const addSalesMySQL = async (req, res, next) => {
    const sales = req.sales
    const queryString = QueryFormatters.objectsToInsert(sales, 'sales')
    const query = new Promise((resolve, reject) => {
        connection.query(queryString, (err, results) => {
            if (err) {
                reject(err)
            } else {
                resolve(results)
            }
        })
    })
    try {
        req.addSalesResults = await query
        return next()
    } catch (err) {
        return next(err)
    }
}

module.exports = {
    findSalesMySQL,
    addSalesMySQL
}