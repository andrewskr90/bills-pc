const QueryFormatters = require('../../../utils/queryFormatters')

const insert = (req, res, next) => {
    const user = req.body.user
    const { columns, values } = QueryFormatters.seperateColumnsValues(user)
    req.queryQueue.push({ query: `INSERT INTO users (${columns}) VALUES (${values});`, variables: [] })
    next()
}

const select = (req, res, next) => {
    const user = req.body.user
    req.queryQueue.push({ query: `SELECT * FROM users where user_name = '${user.user_name}';`, variables: [] })
    next()
}

module.exports = {
    insert,
    select
}
