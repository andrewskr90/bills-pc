const { executeQueries } = require('../db')
const { stringifyDateYYYYMMDD } = require('../utils/date')

const selectByItemIdsBetweenDates = async (items, formerDate, latterDate) => {
    if (items.length === 0) return []
    const dateWithTicks = '`date`'
    let query = `
        SELECT 
            i.id as itemId, 
            m.price as marketPrice, 
            m.${dateWithTicks} as marketPriceDate,
            p.printing_id as printingId,
            c.condition_id as conditionId,
            SKU.id as skuId
        FROM MarketPrice as m
        LEFT JOIN SKU
            ON SKU.id = m.skuId
        LEFT JOIN conditions c
            ON c.condition_id = SKU.conditionId
        LEFT JOIN printings p
            ON p.printing_id = SKU.printingId
        LEFT JOIN Item as i
            ON i.id = SKU.itemId
        WHERE 
            (
            ${items.map((item, idx) => {
                if (idx === 0) return `(SKU.itemId = '${item.itemId}' AND SKU.printingId = '${item.printingId}' AND SKU.conditionId = '${item.conditionId}') `
                return `OR (SKU.itemId = '${item.itemId}' AND SKU.printingId = '${item.printingId}' AND SKU.conditionId = '${item.conditionId}') `
            }).join('')}
            )
        AND m.date >= '${stringifyDateYYYYMMDD(formerDate)}'
        AND m.date < '${stringifyDateYYYYMMDD(latterDate)}'
        ORDER BY itemId`
    const req = { queryQueue: [query] }
    const res = {}
    let marketPrices
    await executeQueries(req, res, (err) => {
        if (err) throw new Error(err)
        marketPrices = req.results
    })
    return marketPrices
}

module.exports = { selectByItemIdsBetweenDates }