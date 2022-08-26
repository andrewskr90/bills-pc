const createConnection = require('..')
const QueryFormatters = require('../../utils/queryFormatters')

const findCollectedCardsMySQL = async (req, res, next) => {
    req.query.collected_card_user_id = req.claims.user_id
    let whereClause = `WHERE ${QueryFormatters.filterConcatinated(req.query)}`
    let queryString = `SELECT * FROM cards 
        RIGHT JOIN collected_cards ON cards.card_id = collected_cards.collected_card_card_id
        LEFT JOIN sets ON cards.card_set_id = sets.set_id 
        LEFT JOIN sale_cards ON sale_cards.sale_card_collected_card_id = collected_card_id 
        LEFT JOIN collected_card_notes ON collected_card_note_collected_card_id = collected_card_id
        ${whereClause}`
    const query = new Promise((resolve, reject) => {
        const connection = createConnection()
        connection.query(queryString, (err, results) => {
            if (err) {
                reject(err)
            } else {
                resolve(results)
                connection.end()
            }
        })
    })
    try {
        req.collectedCards = await query
        return next()
    } catch (err) {
        return next(err)
    }
}

const addCollectedCardsMySQL = async (req, res, next) => {
    const collectedCards = req.collectedCards
    const queryString = QueryFormatters.objectsToInsert(collectedCards, 'collected_cards')
    const query = new Promise((resolve, reject) => {
        const connection = createConnection()
        connection.connect()
        connection.query(queryString, (err, results) => {
            if (err) {
                reject(err)
            } else {
                resolve(results)
                connection.end()
            }
        })
    })
    try {
        req.addCollectedCardsResults = await query
        return next()
    } catch (err) {
        return next(err)
    }
}

module.exports = {
    addCollectedCardsMySQL,
    findCollectedCardsMySQL
}