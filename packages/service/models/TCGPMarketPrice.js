const { executeQueries } = require("../db")
const QueryFormatters = require("../utils/queryFormatters")

const create = async (prices) => {
    const queryQueue = []
    const query = QueryFormatters.objectsToInsert(prices, 'MarketPrice')
    queryQueue.push(query)
    const req = { queryQueue }
    const res = {}
    await executeQueries(req, res, (err) => {
        if (err) throw err
    })
    return prices.map(price => price.id)
}

module.exports = { create }
