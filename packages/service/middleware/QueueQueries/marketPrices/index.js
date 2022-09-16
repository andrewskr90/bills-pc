const QueryFormatters = require('../../../utils/queryFormatters')

const insert = (req, res, next) => {
    const marketPrices = req.body
    const query = QueryFormatters.objectsToInsert(marketPrices, 'market_prices')
    req.queryQueue.push(query)
    next()
}

const select = (req, res, next) => {
    let query
    if (Object.keys(req.query).length > 0) {
        queryFilter = QueryFormatters.filterConcatinated(req.query)
        query = `SELECT * FROM market_prices WHERE ${queryFilter} ORDER BY created_date DESC LIMIT 10;`
    } else {
        query = 'SELECT * FROM market_prices;'
    }
    req.queryQueue.push(query)
    next()
}

module.exports = {
    insert,
    select
}
