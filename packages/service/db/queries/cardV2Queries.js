const createConnection = require('..')
const QueryFormatters = require('../../utils/queryFormatters')

//find, add, update, remove verbage

const addCardsV2MySQL = async (req, res, next) => {
    const cards = req.cards
    const query = QueryFormatters.objectsToInsert(cards, 'cards_v2')
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

const getCardsV2MySQL = async (req, res, next) => {
    let query
    if (Object.keys(req.query).length > 0) {
        const filter = QueryFormatters.filterConcatinated(req.query)
        query = `SELECT * FROM cards_v2 WHERE ${filter}`
    } else {
        query = 'SELECT * FROM cards_v2 LIMIT 50'
    }
    try {
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
    } catch (err) {
        next(err)
    }
}

const getCardsV2BySetIdMySQL = async (req, res, next) => {
    const setId = req.params.setId
    const query = `SELECT * FROM cards_v2 WHERE card_v2_set_id = '${setId}'`
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
    addCardsV2MySQL,
    getCardsV2MySQL,
    getCardsV2BySetIdMySQL
}
