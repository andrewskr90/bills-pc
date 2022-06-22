const connection = require('..')
const QueryFormatters = require('../../utils/QueryFormatters')

//find, add, update, remove verbage

const addUserMySQL = (req, res, next) => {
    const user = req.user
    const { columns, values } = QueryFormatters.seperateColumnsValues(user)
    const query = `INSERT INTO users (${columns}) VALUES (${values});`

    connection.query(query, (err, results) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return next({ status: 409, message: 'Trainer name taken.'})
            }
            return next(err)
        }
        req.results = results
        next()
    })
}

const findUsersByFilterMySQL = (req, res, next) => {
    const preppedFilter = req.preppedFilter
    const queryFilter = QueryFormatters.filterConcatinated(preppedFilter)
    const query = `SELECT * FROM users WHERE ${queryFilter};`
    connection.query(query, (err, results) => {
        if (err) {
            next(err)
        } else if (!results[0]) {
            next({ message: 'Incorrect username and password.' })
        }
        req.results = results[0]
        next()
    })
}

// const updateUser
// const removeUser

module.exports = {
    addUserMySQL,
    findUsersByFilterMySQL
}
