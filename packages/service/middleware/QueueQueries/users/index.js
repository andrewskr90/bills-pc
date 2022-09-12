const QueryFormatters = require('../../../utils/queryFormatters')

const insert = (req, res, next) => {
    const user = req.body.user
    const { columns, values } = QueryFormatters.seperateColumnsValues(user)
    req.queryQueue.push(`INSERT INTO users (${columns}) VALUES (${values});`)
    next()
}

const select = (req, res, next) => {
    const user = req.body.user
    req.queryQueue.push(`SELECT * FROM users where user_name = '${user.user_name}';`)
    next()
}

module.exports = {
    insert,
    select
}
