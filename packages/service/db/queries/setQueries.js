const connection = require('..')
const QueryFormatters = require('../../utils/queryFormatters')

//find, add, update, remove verbage

const addSetsMySQL = async (req, res, next) => {
    const sets = req.sets
    const query = QueryFormatters.objectsToInsert(sets, 'sets_v2')
    connection.query(query, (err, results) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return next({ status: 400, message: 'Set(s) already inserted.'})
            }
            return next(err)
        } else {
            req.results = results
            next()
        }
    })
}

const getSetsMySQL = async (req, res, next) => {
    let query = `SELECT * FROM sets_v2`
    // if query params exist, add it to query
    if (Object.keys(req.query).length > 0) {
        let queryFilter = QueryFormatters.filterConcatinated(req.query)
        query += ` WHERE ${queryFilter}`
    }

    connection.query(query, (err, results) => {
        if (err) {
            return next(err)
        } else {
            req.results = results
            return next()
        }
    })
}

const getSetByPtcgioIdMySQL = async (req, res, next) => {
    const set_ptcgio_id = req.setPtcgioId
    const queryFilter = QueryFormatters.filterConcatinated({ set_ptcgio_id })
    const query = `SELECT * FROM sets WHERE ${queryFilter};`
    connection.query(query, (err, results) => {
        if (err) {
            return next(err)
        }
        req.set = results[0]
        return next()
    })
}

module.exports = {
    addSetsMySQL,
    getSetsMySQL,
    getSetByPtcgioIdMySQL
}
