const createConnection = require('..')
const QueryFormatters = require('../../utils/queryFormatters')

const addSaleNotesMySQL = async (req, res, next) => {
    const saleNotes = req.saleNotes
    if (saleNotes.length > 0) {
        const queryString = QueryFormatters.objectsToInsert(saleNotes, 'sale_notes')
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
            req.addSaleNotesResults = await query
            return next()
        } catch (err) {
            return next(err)
        }
    } else {
        req.addSaleNotesResults = { affectedRows: 0 }
        next()
    }
}

module.exports = {
    addSaleNotesMySQL
}
