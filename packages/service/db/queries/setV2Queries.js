const connection = require('..')
const QueryFormatters = require('../../utils/queryFormatters')

//find, add, update, remove verbage

const addSetsV2MySQL = async (req, res, next) => {
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

const getSetsV2MySQL = async (req, res, next) => {
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

const getSetV2ByPtcgioIdMySQL = async (req, res, next) => {
    const set_ptcgio_id = req.setPtcgioId
    const queryFilter = QueryFormatters.filterConcatinated({ set_ptcgio_id })
    const query = `SELECT * FROM sets_v2 WHERE ${queryFilter};`
    connection.query(query, (err, results) => {
        if (err) {
            return next(err)
        }
        req.set = results[0]
        return next()
    })
}

module.exports = {
    addSetsV2MySQL,
    getSetsV2MySQL,
    getSetV2ByPtcgioIdMySQL
}
