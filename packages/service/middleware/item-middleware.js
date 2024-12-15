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
    let itemTypeWhereWithOr = ''
    if (req.query.expansionid) {
        whereVariables['set_v2_id'] = req.query.expansionid
    }
    if (req.query['filter-itemtype']) {
        itemTypeWhereWithOr = '(' + req.query['filter-itemtype'].split(',')
            .map((singularType, idx) => {
                if (singularType === 'card') return `c.condition_id != '7e464ec6-0b23-11ef-b8b9-0efd996651a9'`
                else if (singularType === 'product') return `c.condition_id = '7e464ec6-0b23-11ef-b8b9-0efd996651a9'`
            }).join(' OR ') + ') '
    }
    let whereStatement = ''
    const whereVarsPresent = Object.keys(whereVariables).length > 0
    if (whereVarsPresent) {
        whereStatement += `WHERE ${QueryFormatters.filterConcatinated(whereVariables)} `
    }
    if (req.query.searchvalue) {
        const { likeAnd, searchVariables } = QueryFormatters.searchValueToLikeAnd(req.query.searchvalue, 'i.name')
        whereStatement += whereVarsPresent ? 'AND ' : 'WHERE '
        whereStatement += likeAnd
        variables.push(...searchVariables)
    }
    if (itemTypeWhereWithOr) {
        if (whereVarsPresent || req.query.searchvalue) {
            whereStatement += `AND ${itemTypeWhereWithOr} `
        } else whereStatement += `WHERE ${itemTypeWhereWithOr} `
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
    const groupBy = ' GROUP BY i.name, i.id'
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
            count(*) OVER () as count, 
            GROUP_CONCAT(
                    '[', p.printing_id, ',', p.printing_name, ',', c.condition_id, ',', c.condition_name, ']' 
                    ORDER BY p.printing_tcgp_printing_id, c.condition_tcgp_condition_id SEPARATOR ','
                ) as printings
        FROM Item as i
        LEFT JOIN sets_v2 as s
            ON  s.set_v2_id = i.setId
        LEFT JOIN SKU
            ON SKU.itemId = i.id
        LEFT JOIN conditions c
            ON c.condition_id = SKU.conditionId
        LEFT JOIN printings p
            ON p.printing_id = SKU.printingId
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