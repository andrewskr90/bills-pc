const QueueQueries = require('../middleware/QueueQueries')
const { executeQueries } = require('../db')
const { v4: uuidV4 } = require('uuid')

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

const createFromListing = async (sale, purchaserId) => {
    console.log(sale, sale.listings[0].offer, purchaserId)
    return uuidV4()
}

module.exports = { 
    findByUserId, 
    select,
    createFromListing
}
