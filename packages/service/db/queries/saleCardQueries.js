const createConnection = require('..')
const QueryFormatters = require('../../utils/queryFormatters')

const addSaleCardsMySQL = async (req, res, next) => {
    const saleCards = req.saleCards
    const queryString = QueryFormatters.objectsToInsert(saleCards, 'sale_cards')
    const query= new Promise((resolve, reject) => {
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
        req.addSaleCardsResults = await query
        return next()
    } catch (err) {
        return next(err)
    }
}

module.exports = {
    addSaleCardsMySQL
}
