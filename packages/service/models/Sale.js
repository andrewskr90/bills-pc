// const { formatSaleResults } = require('../middleware/sale-middleware')
// const QueueQueries = require('../middleware/QueueQueries')
const { executeQueries } = require('../db')

const findByUserId = async (req, res, next) => {
    QueueQueries.init(req, res, (err) => {
        if (err) next(err)
    })
    QueueQueries.portfolio.selectByUserId(req, res, (err) => {
        if (err) next(err)
    })
    await executeQueries(req, res, (err) => {
        if (err) next(err)
    })
    formatSaleResults(req, res, (err) => {
        if (err) next(err)
    })
    req.sales = req.results
    next()
}

const select = async (userId) => {
    let query = `
        SELECT * FROM sales
        WHERE 
            sale_purchaser_id = '${userId}' OR
            sale_seller_id = '${userId}'
    ;`
    const req = { queryQueue: [query] }
    const res = {}
    let sales
    await executeQueries(req, res, (err) => {
        if (err) throw new Error(err)
        sales = req.results
    })
    return sales

}

module.exports = { 
    findByUserId, 
    select }
