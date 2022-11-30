const QueryFormatters = require('../../../utils/queryFormatters')

const insert = (req, res, next) => {
    const marketPrices = req.body
    const query = QueryFormatters.objectsToInsert(marketPrices, 'market_prices')
    req.queryQueue.push(query)
    next()
}

const selectByCardId = (req, res, next) => {
    // created_date is essential for marketPriceScraper
    let query = `SELECT * FROM market_prices WHERE market_price_card_id = '${req.params.card_id}' ORDER BY created_date DESC`
    if (req.query.limit) {
        query += ` LIMIT ${req.query.limit}`
    }
    query += ';'
    req.queryQueue.push(query)
    next()
}

const selectByProductId = (req, res, next) => {
    // created_date is essential for marketPriceScraper
    let query = `SELECT * FROM market_prices WHERE market_price_product_id = '${req.params.product_id}' ORDER BY created_date DESC`
    if (req.query.limit) {
        query += ` LIMIT ${req.query.limit}`
    }
    query += ';'
    req.queryQueue.push(query)
    next()
}

const selectBySetId = (req, res, next) => {
    let query = `SELECT 
        GROUP_CONCAT('[',UNIX_TIMESTAMP(m.created_date), ',', m.market_price_price,']' ORDER BY m.created_date DESC SEPARATOR ',') as market_price_prices,
        NULL AS product_id,
        NULL AS product_name,
        NULL AS product_release_date,
        NULL AS product_description,
        c.card_v2_tcgplayer_product_id as tcgplayer_product_id,
        c.card_v2_id,
        c.card_v2_name,
        c.card_v2_number,
        c.card_v2_rarity,
        c.card_v2_foil_only,
        s.set_v2_id,
        s.set_v2_name,
        s.set_v2_ptcgio_id,
        s.set_v2_release_date,
        s.set_v2_series
    FROM market_prices as m
    LEFT JOIN cards_v2 as c
        ON c.card_v2_id = m.market_price_card_id
    LEFT JOIN sets_v2 as s
        ON  s.set_v2_id = c.card_v2_set_id
    WHERE s.set_v2_id = '${req.params.set_v2_id}'
    GROUP BY card_v2_id
    UNION
    SELECT 
        GROUP_CONCAT('[',UNIX_TIMESTAMP(m2.created_date), ',', m2.market_price_price,']' ORDER BY m2.created_date DESC) as market_price_prices,
        p2.product_id,
        p2.product_name,
        p2.product_release_date,
        p2.product_description,
        p2.product_tcgplayer_product_id as tcgplayer_product_id,
        NULL AS card_v2_id,
        NULL AS card_v2_name,
        NULL AS card_v2_number,
        NULL AS card_v2_rarity,
        NULL AS card_v2_foil_only,
        s2.set_v2_id,
        s2.set_v2_name,
        s2.set_v2_ptcgio_id,
        s2.set_v2_release_date,
        s2.set_v2_series
    FROM market_prices as m2
    LEFT JOIN products as p2
        ON p2.product_id = m2.market_price_product_id
    LEFT JOIN sets_v2 as s2
        ON  s2.set_v2_id = p2.product_set_id
    WHERE s2.set_v2_id = '${req.params.set_v2_id}'
    GROUP BY product_id;`
    req.queryQueue.push(query)
    next()
}

const selectTopTenAverage = (req, res, next) => {
    let query = `SELECT set_v2_id, set_v2_name, set_v2_ptcgio_id, set_v2_release_date, set_v2_series,
        (SELECT AVG(top_ten_cards.latest_price)
        FROM (SELECT
            (select market_price_price from market_prices WHERE market_price_card_id = card_v2_id ORDER BY market_prices.created_date DESC LIMIT 1) as latest_price
        FROM cards_v2
        WHERE set_v2_id = card_v2_set_id
        ORDER BY latest_price DESC
        LIMIT 10) top_ten_cards) as top_ten_average_today
    FROM sets_v2;`
    req.queryQueue.push(query)
    next()
}

module.exports = {
    insert,
    selectBySetId,
    selectByCardId,
    selectByProductId,
    selectTopTenAverage
}
