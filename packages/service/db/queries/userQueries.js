const createConnection = require('..')
const QueryFormatters = require('../../utils/queryFormatters')

//find, add, update, remove verbage

const addUserMySQL = (req, res, next) => {
    const user = req.user
    const { columns, values } = QueryFormatters.seperateColumnsValues(user)
    const query = `INSERT INTO users (${columns}) VALUES (${values});`
    const connection = createConnection()
    connection.connect()
    connection.query(query, (err, results) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return next({ status: 409, message: 'Trainer name taken.'})
            }
            return next(err)
        }
        req.results = results
        connection.end()
        next()
    })
}

const findUsersByFilterMySQL = (req, res, next) => {
    const preppedFilter = req.preppedFilter
    const queryFilter = QueryFormatters.filterConcatinated(preppedFilter)
    const query = `SELECT * FROM users WHERE ${queryFilter};`
    const connection = createConnection()
    connection.connect()
    connection.query(query, (err, results) => {
        if (err) {
            next(err)
        }
        if (results === 'undefined') {
            console.log('findUsersByFilterMySQL results undefined. Results:', results)
            console.log('preppedFilter:', preppedFilter)
            console.log('query:', query)
            console.log(Date.now())
            next({
                message: 'findUsersByFilterMySQL results are undefined.'
            })
        }
        req.users = results
        connection.end()
        next()
    })
}

// const updateUser
// const removeUser

module.exports = {
    addUserMySQL,
    findUsersByFilterMySQL
}
