const QueryFormatters = require('../../../utils/queryFormatters')

const insert = (req, res, next) => {
    const cards = req.cards
    const query = QueryFormatters.objectsToInsert(cards, 'cards_v2')
    req.queryQueue.push({ query, variables: [] })
    next()
}

const select = (req, res, next) => {
    let query

    if (Object.keys(req.query).length > 0) {
        const filter = QueryFormatters.filterConcatinated(req.query)
        query = `SELECT * FROM cards_v2 WHERE ${filter}`
    } else {
        query = 'SELECT * FROM cards_v2 LIMIT 50'
    }
    req.queryQueue.push({ query, variables: [] })
    next()
}

const selectWithValues = (req, res, next) => {
    // each keyword in searchValue must be included in card name. 
    // This means rarities are not compatable yet
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
        ON  s.set_v2_id = c.card_v2_set_id`
    if (Object.keys(req.query).length > 0) {
        if (req.query.searchValue) {
            query += QueryFormatters.searchValueToWhereLike(req.query.searchValue, 'c.card_v2_name')
        }
    }
    query += ' GROUP BY card_v2_id;'
    req.queryQueue.push({ query, variables: [] })
    next()
}

const selectBySetId = (req, res, next) => {
    const setId = req.params.setId
    const query = `SELECT * FROM cards_v2 WHERE card_v2_set_id = '${setId}'`
    req.queryQueue.push({ query, variables: [] })
    next()
}

module.exports = {
    insert,
    select,
    selectWithValues,
    selectBySetId
}
