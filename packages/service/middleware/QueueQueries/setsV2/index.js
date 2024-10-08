const QueryFormatters = require('../../../utils/queryFormatters')

const insert = (req, res, next) => {
    const sets= req.sets
    const query = QueryFormatters.objectsToInsert(sets, 'sets_v2')
    req.queryQueue.push(query)
    next()
}

const select = (req, res, next) => {
    let query = `SELECT * FROM sets_v2`
    // if query params exist, add it to query
    if (Object.keys(req.query).length > 0) {
        let queryFilter = QueryFormatters.filterConcatinated(req.query)
        query += ` WHERE ${queryFilter}`
    }
    query += ` ORDER BY set_v2_release_date ASC;`
    req.queryQueue.push(query)
    next()
}

const update = (req, res, next) => {
    const set_v2_id = req.params.set_v2_id
    const patchedValues = req.body
    const setStatement = QueryFormatters.formatSetStatement(patchedValues)
    const query = `UPDATE sets_v2 SET ${setStatement} WHERE set_v2_id='${set_v2_id}'`
    req.queryQueue.push(query)
    next()
}
module.exports = {
    insert,
    select,
    update
}
