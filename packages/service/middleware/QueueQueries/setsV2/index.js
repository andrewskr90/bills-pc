const QueryFormatters = require('../../../utils/queryFormatters')

const insert = (req, res, next) => {
    const sets= req.sets
    const query = QueryFormatters.objectsToInsert(sets, 'sets_v2')
    req.queryQueue.push({ query, variables: [] })
    next()
}

const select = (req, res, next) => {
    let query = `SELECT * FROM sets_v2`
    const variables = []
    // if query params exist, add it to query
    if (req.query.filter) {
        let queryFilter = QueryFormatters.filterConcatinated(req.query.filter)
        query += ` WHERE ${queryFilter}`
    }
    query += ` ORDER BY set_v2_release_date DESC, set_v2_name ASC`
    const pageInt = parseInt(req.query.page)
    if (pageInt && pageInt > 0) {
        variables.push((pageInt-1)*10)
        query += ` LIMIT ?,10;`
    } else {
        query += ` LIMIT 1,10;`
    }
    req.queryQueue.push({ query, variables })
    next()
}

const update = (req, res, next) => {
    const set_v2_id = req.params.set_v2_id
    const patchedValues = req.body
    const setStatement = QueryFormatters.formatSetStatement(patchedValues)
    const query = `UPDATE sets_v2 SET ${setStatement} WHERE set_v2_id='${set_v2_id}'`
    req.queryQueue.push({ query, variables: [] })
    next()
}
module.exports = {
    insert,
    select,
    update
}
