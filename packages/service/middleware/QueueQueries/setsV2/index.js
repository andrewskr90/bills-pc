const QueryFormatters = require('../../../utils/queryFormatters')

const insert = (req, res, next) => {
    const sets= req.sets
    const query = QueryFormatters.objectsToInsert(sets, 'sets_v2')
    req.queryQueue.push({ query, variables: [] })
    next()
}

const select = (req, res, next) => {
    const whereVariables = {}
    if (req.query.set_v2_id) {
        whereVariables['set_v2_id'] = req.query.set_v2_id
    }
    if (req.query.set_v2_tcgplayer_set_id) {
        whereVariables['set_v2_tcgplayer_set_id'] = req.query.set_v2_tcgplayer_set_id
    }
    const direction = req.query.direction ? req.query.direction.toLowerCase() : undefined 
    const attribute = req.query.attribute ? req.query.attribute.toLowerCase() : undefined
    let orderBy = ``
    if (attribute && attribute.toLowerCase() === 'name') {
        orderBy = ' ORDER BY set_v2_name'
        if (direction && direction.toLowerCase() === 'desc') orderBy += ' DESC'
        else orderBy += ' ASC'
    } else {
        orderBy =  ' ORDER BY set_v2_release_date'
        if (direction && direction.toLowerCase() === 'asc') orderBy += ' ASC'
        else orderBy += ' DESC'
        orderBy += ', set_v2_name ASC'
    }
    let query = `
        SELECT
            set_v2_id,
            set_v2_name,
            set_v2_series, 
            set_v2_tcgplayer_set_id, 
            set_v2_ptcgio_id, 
            set_v2_release_date,
            count(*) OVER () as count
        FROM sets_v2 
        ${Object.keys(whereVariables).length > 0 ? 
        `WHERE ${QueryFormatters.filterConcatinated(whereVariables)} ` : ''}
    `
    const variables = []
    query += orderBy
    const pageInt = parseInt(req.query.page)
    if (pageInt && pageInt > 0) {
        variables.push((pageInt-1)*20)
        query += ` LIMIT ?,20;`
    } else {
        query += ` LIMIT 0,20;`
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
