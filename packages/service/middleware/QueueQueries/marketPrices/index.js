const QueryFormatters = require('../../../utils/queryFormatters')
const { executeQueries } = require('../../../db/index')

const insert = (req, res, next) => {
    const marketPrices = req.body
    const query = QueryFormatters.objectsToInsert(marketPrices, 'market_prices')
    req.queryQueue.push({ query, variables: [] })
    next()
}

const selectByCardId = (req, res, next) => {
    // created_date is essential for marketPriceScraper
    let query = `SELECT * FROM market_prices WHERE market_price_card_id = '${req.params.card_id}' ORDER BY created_date DESC`
    if (req.query.limit) {
        query += ` LIMIT ${req.query.limit}`
    }
    query += ';'
    req.queryQueue.push({ query, variables: [] })
    next()
}

const selectByProductId = (req, res, next) => {
    // created_date is essential for marketPriceScraper
    let query = `SELECT * FROM market_prices WHERE market_price_product_id = '${req.params.product_id}' ORDER BY created_date DESC`
    if (req.query.limit) {
        query += ` LIMIT ${req.query.limit}`
    }
    query += ';'
    req.queryQueue.push({ query, variables: [] })
    next()
}

const selectByItemId = (req, res, next) => {
    const variables = []
    let query = `
    SELECT 
        GROUP_CONCAT('[',UNIX_TIMESTAMP(m.date), ',', m.price,']' ORDER BY m.date DESC) as prices,
        i.id,
        i.name,
        i.tcgpId,
        s.set_v2_id,
        s.set_v2_name,
        s.set_v2_ptcgio_id,
        s.set_v2_release_date,
        s.set_v2_series,
        c.condition_id,
        c.condition_name,
        p.printing_id,
        p.printing_name,
        p.printing_tcgp_printing_id
    FROM SKU
    LEFT JOIN MarketPrice as m
        ON m.skuId = SKU.id
    LEFT JOIN conditions c
        ON c.condition_id = SKU.conditionId
    LEFT JOIN printings p
        ON p.printing_id = SKU.printingId
    LEFT JOIN Item as i
        ON i.id = SKU.itemId
    LEFT JOIN sets_v2 as s
        ON  s.set_v2_id = i.setId
    WHERE i.id = ?
        AND (c.condition_id = '0655c457-ff60-11ee-b8b9-0efd996651a9' OR c.condition_id = '7e464ec6-0b23-11ef-b8b9-0efd996651a9')
    GROUP BY SKU.id
    ORDER BY i.name asc, p.printing_tcgp_printing_id, c.condition_tcgp_condition_id;`
    variables.push(req.params.item_id)
    req.queryQueue.push({ query, variables })
    next()
}

const selectBySetId = (req, res, next) => {
    const variables = []
    let query = `
    SELECT 
        GROUP_CONCAT('[',UNIX_TIMESTAMP(m.date), ',', m.price,']' ORDER BY m.date DESC) as prices,
        i.id,
        i.name,
        i.tcgpId,
        s.set_v2_id,
        s.set_v2_name,
        s.set_v2_ptcgio_id,
        s.set_v2_release_date,
        s.set_v2_series,
        c.condition_id,
        c.condition_name,
        p.printing_id,
        p.printing_name,
        p.printing_tcgp_printing_id
    FROM SKU
    LEFT JOIN MarketPrice as m
        ON m.skuId = SKU.id
    LEFT JOIN conditions c
        ON c.condition_id = SKU.conditionId
    LEFT JOIN printings p
        ON p.printing_id = SKU.printingId
    LEFT JOIN Item as i
        ON i.id = SKU.itemId
    LEFT JOIN sets_v2 as s
        ON  s.set_v2_id = i.setId
    WHERE s.set_v2_id = ?
        AND (c.condition_id = '0655c457-ff60-11ee-b8b9-0efd996651a9' OR c.condition_id = '7e464ec6-0b23-11ef-b8b9-0efd996651a9')
    GROUP BY SKU.id
    ORDER BY i.name asc, p.printing_tcgp_printing_id, c.condition_tcgp_condition_id;`
    variables.push(req.params.set_v2_id)
    req.queryQueue.push({ query, variables })
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
    req.queryQueue.push({ query, variables: [] })
    next()
}
module.exports = {
    insert,
    selectBySetId,
    selectByCardId,
    selectByProductId,
    selectTopTenAverage,
    selectByItemId
}
