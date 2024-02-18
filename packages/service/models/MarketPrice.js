const { executeQueries } = require('../db')
const { stringifyDateYYYYMMDD } = require('../utils/date')

const selectByCardIdsBetweenDates = async (ids, formerDate, latterDate) => {
    let query = `SELECT * FROM market_prices 
        WHERE 
            (
            ${ids.map((id, idx) => {
                if (idx === 0) return `market_price_card_id = '${id}' `
                return `OR market_price_card_id = '${id}' `
            }).join('')}
            )
        AND created_date >= '${stringifyDateYYYYMMDD(formerDate)}'
        AND created_date < '${stringifyDateYYYYMMDD(latterDate)}'
        ORDER BY market_price_card_id;`
    const req = { queryQueue: [query] }
    const res = {}
    let marketPrices
    await executeQueries(req, res, (err) => {
        if (err) throw new Error(err)
        marketPrices = req.results
    })
    return marketPrices
}

const selectByProductIdsBetweenDates = async (ids, formerDate, latterDate) => {
    let query = `SELECT * FROM market_prices 
        WHERE 
            (
            ${ids.map((id, idx) => {
                if (idx === 0) return `market_price_product_id = '${id}' `
                return `OR market_price_product_id = '${id}' `
            }).join('')}
            )
        AND created_date >= '${formerDate}'
        AND created_date < '${latterDate}'
        ORDER BY market_price_product_id`
    const req = { queryQueue: [query] }
    const res = {}
    let marketPrices
    await executeQueries(req, res, (err) => {
        if (err) throw new Error(err)
        marketPrices = req.results
    })
    return marketPrices
}


module.exports = { selectByCardIdsBetweenDates, selectByProductIdsBetweenDates }