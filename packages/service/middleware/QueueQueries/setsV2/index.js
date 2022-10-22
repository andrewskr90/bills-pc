const QueryFormatters = require('../../../utils/queryFormatters')

const insert = (req, res, next) => {
    const sets= req.body.sets
    const { columns, values } = QueryFormatters.seperateColumnsValues(sets)
    req.queryQueue.push(`INSERT INTO sets_v2 (${columns}) VALUES (${values});`)
    next()
}

const select = (req, res, next) => {
    let query = `SELECT * FROM sets_v2`
    // if query params exist, add it to query
    if (Object.keys(req.query).length > 0) {
        let queryFilter = QueryFormatters.filterConcatinated(req.query)
        query += ` WHERE ${queryFilter}`
    }
    query += ` ORDER BY set_v2_name ASC;`
    req.queryQueue.push(query)
    next()
}

const update = (req, res, next) => {
    const set_v2_id = req.params.set_v2_id
    const updatedSet = req.body
    const setStatement = QueryFormatters.formatSetStatement(updatedSet)
    const query = `UPDATE sets_v2 SET ${setStatement} WHERE set_v2_id='${set_v2_id}'`
    req.queryQueue.push(query)
    next()
}
module.exports = {
    insert,
    select,
    update
}
