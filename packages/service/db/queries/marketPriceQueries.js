const createConnection = require('..')
const QueryFormatters = require('../../utils/queryFormatters')

const addMarketPricesMySQL = (req, res, next) => {
    const marketPrices = req.body
    const query = QueryFormatters.objectsToInsert(marketPrices, 'market_prices')
    const connection = createConnection()
    connection.connect()
    connection.query(query, (err, results) => {
        if (err) {
            return next(err)
        } else {
            req.results = results
            connection.end()
            return next()
        }
    })
}

const getMarketPricesMySQL = async (req, res, next) => {
    let query
    
    if (Object.keys(req.query).length > 0) {
        if (req.query.marketplace) {
            // query to get market values of cards and products, based on timeframe
            let timeframe
            if (req.query.timeframe) {
                timeframe = req.query.timeframe
            } else {
                timeframe = '1'
            }
            // query = `SELECT * FROM `
        } else {
            // this query is specifically used by market-price-scraper, to ensure one scrape a day
            queryFilter = QueryFormatters.filterConcatinated(req.query)
            query = `SELECT * FROM market_prices WHERE ${queryFilter} ORDER BY created_date DESC LIMIT 10;`
        }
    } else {
        query = 'SELECT * FROM market_prices;'
    }
    const connection = createConnection()
    connection.connect()
    connection.query(query, (err, results) => {
        if (err) {
            return next(err)
        } else {
            req.results = results
            connection.end()
            return next()
        }
    })
}

module.exports = {
    addMarketPricesMySQL,
    getMarketPricesMySQL
}