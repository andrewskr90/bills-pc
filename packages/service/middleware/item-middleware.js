const Item = require('../models/Item')
const QueryFormatters = require('../utils/queryFormatters')

const createItems = async (req, res, next) => {
    try {
        req.ids = await Item.create(req.body)
        next()
    } catch (err) {
        return next(err)
    }
}

const getItems = async (req, res, next) => {
    const whereVariables = {}
    const variables = []
    if (req.query.expansionid) {
        whereVariables['set_v2_id'] = req.query.expansionid
    }
    // if (req.query.set_v2_tcgplayer_set_id) {
    //     whereVariables['set_v2_tcgplayer_set_id'] = req.query.set_v2_tcgplayer_set_id
    // }
    let whereStatement = ''
    if (Object.keys(whereVariables).length > 0) {
        whereStatement += `WHERE ${QueryFormatters.filterConcatinated(whereVariables)} `
        if (req.query.searchvalue) {
            const { likeAnd, searchVariables } = QueryFormatters.searchValueToLikeAnd(req.query.searchvalue, 'i.name')
            whereStatement += likeAnd
            variables.push(...searchVariables)
        }
    } else {
        if (req.query.searchvalue) {
            const { likeAnd, searchVariables } = QueryFormatters.searchValueToLikeAnd(req.query.searchvalue, 'i.name')
            whereStatement += 'WHERE '
            whereStatement += likeAnd
            variables.push(...searchVariables)
        }
    }
    const direction = req.query.direction ? req.query.direction.toLowerCase() : undefined 
    const attribute = req.query.attribute ? req.query.attribute.toLowerCase() : undefined
    let orderBy = ``
    if (attribute && attribute.toLowerCase() === 'expansionname') {
        orderBy = ' ORDER BY set_v2_name'
        if (direction && direction.toLowerCase() === 'desc') orderBy += ' DESC'
        else orderBy += ' ASC'
    } else {
        orderBy =  ' ORDER BY name'
        if (direction && direction.toLowerCase() === 'desc') orderBy += ' DESC'
        else orderBy += ' ASC'
        orderBy += ', set_v2_name ASC'
    }
    let groupBy = ``
    if (req.query.includeprintings && req.query.includeprintings.toLowerCase() === 'true') {
        groupBy += ' GROUP BY i.name, i.id'
    }
    let query = `
        SELECT 
            i.id,
            i.name,
            i.tcgpId,
            s.set_v2_id,
            s.set_v2_name,
            s.set_v2_ptcgio_id,
            s.set_v2_release_date,
            s.set_v2_series,
            count(*) OVER () as count
            ${req.query.includeprintings && req.query.includeprintings.toLowerCase() === 'true'
                ? `, GROUP_CONCAT(
                    '[', p.printing_id, ',', p.printing_name, ',', c.condition_id, ',', c.condition_name, ']' 
                    ORDER BY p.printing_tcgp_printing_id, c.condition_tcgp_condition_id SEPARATOR ','
                ) as printings`
                : ``}
        FROM Item as i
        LEFT JOIN sets_v2 as s
            ON  s.set_v2_id = i.setId
        ${req.query.includeprintings && req.query.includeprintings.toLowerCase() === 'true' ? `
            LEFT JOIN SKU
                ON SKU.itemId = i.id
            LEFT JOIN conditions c
                ON c.condition_id = SKU.conditionId
            LEFT JOIN printings p
                ON p.printing_id = SKU.printingId
        ` : ``}
    `
    query += whereStatement
    query += groupBy
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

const patchItem = async (req, res, next) => {
    if (req.query.tcgpId) {
        req.results = await Item.patchByTcgpId(req.query.tcgpId, req.body)
    } else {
        next({ status: 500, message: 'tcgpId param is not present.' })
    }
}

module.exports = { createItems, getItems, patchItem }