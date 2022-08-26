const createConnection = require('..')
const QueryFormatters = require('../../utils/queryFormatters')

//find, add, update, remove verbage

const addCardsMySQL = async (req, res, next) => {
    const cards = req.cards
    const query = QueryFormatters.objectsToInsert(cards, 'cards')
    const connection = createConnection()
    connection.connect()
    connection.query(query, (err, results) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return next({ status: 400, message: 'Card(s) already inserted.'})
            }
            return next(err)
        } else {
            req.results = results
            connection.end()
            return next()
        }
    })
}

const getCardsBySetIdMySQL = async (req, res, next) => {
    const setId = req.params.setId
    const query = `SELECT * FROM cards WHERE card_set_id = '${setId}'`
    const connection = createConnection()
    connection.connect()
    connection.query(query, (err, results) => {
        if (err) {
            return next(err)
        } else {
            req.results = results
            connection.end()
            return next()
        }
    })
}

module.exports = {
    addCardsMySQL,
    getCardsBySetIdMySQL
}
