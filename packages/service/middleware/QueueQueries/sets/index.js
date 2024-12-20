const QueryFormatters = require('../../../utils/queryFormatters')

const insert = (req, res, next) => {
    const sets= req.body.sets
    const { columns, values } = QueryFormatters.seperateColumnsValues(sets)
    req.queryQueue.push({ query: `INSERT INTO sets (${columns}) VALUES (${values});`, variables: [] })
    next()
}

const select = (req, res, next) => {
    let query = `SELECT * FROM sets`
    // if query params exist, add it to query
    if (Object.keys(req.query).length > 0) {
        let queryFilter = QueryFormatters.filterConcatinated(req.query)
        query += ` WHERE ${queryFilter}`
    }
    req.queryQueue.push({ query, variables: [] })
    next()
}

module.exports = {
    insert,
    select
}
