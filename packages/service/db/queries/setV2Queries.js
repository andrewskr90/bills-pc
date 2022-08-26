const createConnection = require('..')
const QueryFormatters = require('../../utils/queryFormatters')

//find, add, update, remove verbage

const addSetsV2MySQL = async (req, res, next) => {
    const sets = req.sets
    const query = QueryFormatters.objectsToInsert(sets, 'sets_v2')
    const connection = createConnection()
    connection.connect()
    connection.query(query, (err, results) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return next({ status: 400, message: 'Set(s) already inserted.'})
            }
            return next(err)
        } else {
            req.results = results
            connection.end()
            next()
        }
    })
}

const getSetsV2MySQL = async (req, res, next) => {
    let query
    if (Object.keys(req.query).length > 0) {
        const filter = QueryFormatters.filterConcatinated(req.query)
        query = `SELECT * FROM sets_v2 WHERE ${filter}`
    } else {
        query = `SELECT * FROM sets_v2`
    }
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

const getSetV2ByPtcgioIdMySQL = async (req, res, next) => {
    const set_ptcgio_id = req.setPtcgioId
    const queryFilter = QueryFormatters.filterConcatinated({ set_ptcgio_id })
    const query = `SELECT * FROM sets_v2 WHERE ${queryFilter};`
    const connection = createConnection()
    connection.connect()
    connection.query(query, (err, results) => {
        if (err) {
            return next(err)
        }
        if (results.length < 1) {
            connection.end()
            return next({
                message: `Set not found under id, ${set_ptcgio_id}`
            })
        }
        req.set = results[0]
        connection.end()
        return next()
    })
}

module.exports = {
    addSetsV2MySQL,
    getSetsV2MySQL,
    getSetV2ByPtcgioIdMySQL
}
