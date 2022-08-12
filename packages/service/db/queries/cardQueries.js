const connection = require('..')
const QueryFormatters = require('../../utils/queryFormatters')

//find, add, update, remove verbage

const addCardsMySQL = async (req, res, next) => {
    const cards = req.cards
    const query = QueryFormatters.objectsToInsert(cards, 'cards_v2')
    connection.query(query, (err, results) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return next({ status: 400, message: 'Card(s) already inserted.'})
            }
            return next(err)
        } else {
            req.results = results
            return next()
        }
    })
}

const getCardsBySetIdMySQL = async (req, res, next) => {
    const setId = req.params.setId
    const query = `SELECT * FROM cards WHERE card_set_id = '${setId}'`

    connection.query(query, (err, results) => {
        if (err) {
            return next(err)
        } else {
            req.results = results
            return next()
        }
    })
}

module.exports = {
    addCardsMySQL,
    getCardsBySetIdMySQL
}
