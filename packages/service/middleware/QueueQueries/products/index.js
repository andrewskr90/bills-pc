const QueryFormatters = require('../../../utils/queryFormatters')

const insert = (req, res, next) => {
    const products = req.products
    const query = QueryFormatters.objectsToInsert(products, 'products')
    req.queryQueue.push({ query, variables: [] })
    next()
}

const select = (req, res, next) => {
    let query
    if (Object.keys(req.query).length > 0) {
        if (req.query.product_id) {
            query = `SELECT * FROM products WHERE product_id = '${req.query.product_id}';`
        } else {
            const setId = req.query.product_set_id
            query = `SELECT * FROM products WHERE product_set_id = '${setId}'`
        }
    } else {
        query = 'SELECT * FROM products;'
    }
    req.queryQueue.push({ query, variables: [] })
    next()
}

const selectWithValues = (req, res, next) => {
    // each keyword in searchValue must be included in card name. 
    // This means rarities are not compatable yet
    let query = `SELECT 
        GROUP_CONCAT('[',UNIX_TIMESTAMP(m.created_date), ',', m.market_price_price,']' ORDER BY m.created_date DESC SEPARATOR ',') as market_price_prices,
        p.product_id,
        p.product_name,
        p.product_release_date,
        p.product_description,
        p.product_tcgplayer_product_id as tcgplayer_product_id,
        NULL AS card_v2_id,
        NULL AS card_v2_name,
        NULL AS card_v2_number,
        NULL AS card_v2_rarity,
        NULL AS card_v2_foil_only,
        s.set_v2_id,
        s.set_v2_name,
        s.set_v2_ptcgio_id,
        s.set_v2_release_date,
        s.set_v2_series
    FROM market_prices as m
    LEFT JOIN products as p
        ON p.product_id = m.market_price_product_id
    LEFT JOIN sets_v2 as s
        ON  s.set_v2_id = p.product_set_id`
    if (Object.keys(req.query).length > 0) {
        if (req.query.searchvalue) {
            query += 'WHERE'
            query += QueryFormatters.searchValueToLikeAnd(req.query.searchvalue, 'p.product_name')
        }
    }
    query += ' GROUP BY product_id;'
    req.queryQueue.push({ query, variables: [] })
    next()
}

module.exports = {
    insert,
    select,
    selectWithValues
}
