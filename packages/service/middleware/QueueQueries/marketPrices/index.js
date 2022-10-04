const QueryFormatters = require('../../../utils/queryFormatters')

const insert = (req, res, next) => {
    const marketPrices = req.body
    const query = QueryFormatters.objectsToInsert(marketPrices, 'market_prices')
    req.queryQueue.push(query)
    next()
}

const select = (req, res, next) => {
    let query
    if (req.query.marketwatch) {
        query = `SELECT 
                GROUP_CONCAT('[',UNIX_TIMESTAMP(m.created_date), ',', m.market_price_price,']' ORDER BY m.created_date DESC SEPARATOR ',') as market_price_prices,
                NULL AS product_id,
                NULL AS product_name,
                NULL AS product_release_date,
                NULL AS product_description,
                c.card_v2_id,
                c.card_v2_name,
                c.card_v2_number,
                c.card_v2_rarity,
                c.card_v2_foil_only,
                s.set_v2_id,
                s.set_v2_name
            FROM market_prices as m
            LEFT JOIN cards_v2 as c
                ON c.card_v2_id = m.market_price_card_id
            LEFT JOIN sets_v2 as s
                ON  s.set_v2_id = c.card_v2_set_id
            WHERE s.set_v2_id = '${req.query.set_v2_id}'
            GROUP BY card_v2_id
            UNION
            SELECT 
                GROUP_CONCAT('[',UNIX_TIMESTAMP(m2.created_date), ',', m2.market_price_price,']' ORDER BY m2.created_date DESC) as market_price_prices,
                p2.product_id,
                p2.product_name,
                p2.product_release_date,
                p2.product_description,
                NULL AS card_v2_id,
                NULL AS card_v2_name,
                NULL AS card_v2_number,
                NULL AS card_v2_rarity,
                NULL AS card_v2_foil_only,
                s2.set_v2_id,
                s2.set_v2_name
            FROM market_prices as m2
            LEFT JOIN products as p2
                ON p2.product_id = m2.market_price_product_id
            LEFT JOIN sets_v2 as s2
                ON  s2.set_v2_id = p2.product_set_id
            WHERE s2.set_v2_id = '${req.query.set_v2_id}'
            GROUP BY product_id`
    } else if (Object.keys(req.query).length > 0) {
        queryFilter = QueryFormatters.filterConcatinated(req.query)
        query = `SELECT * FROM market_prices WHERE ${queryFilter} ORDER BY created_date DESC LIMIT 10;`
    }
    req.queryQueue.push(query)
    next()
}

module.exports = {
    insert,
    select
}
