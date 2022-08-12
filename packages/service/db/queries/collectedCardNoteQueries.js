const connection = require('..')
const QueryFormatters = require('../../utils/queryFormatters')

const addCollectedCardNotesMySQL = async (req, res, next) => {
    const collectedCardNotes = req.collectedCardNotes
    if (collectedCardNotes.length > 0) {
        const queryString = QueryFormatters.objectsToInsert(collectedCardNotes, 'collected_card_notes')
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
            req.addCollectedCardNotesResults = await query
            return next()
        } catch (err) {
            next(err)
        }
    } else {
        req.addCollectedCardNotesResults = { affectedRows: 0 }
        next()
    }
}

module.exports = {
    addCollectedCardNotesMySQL
}
