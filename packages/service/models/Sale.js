const QueueQueries = require('../middleware/QueueQueries')
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
    next()
}

const select = async (userId) => {
    let query = `
        SELECT * FROM sales
        WHERE 
            sale_purchaser_id = ? OR
            sale_seller_id = ?
    ;`
    const req = { queryQueue: [{ query, variables: [userId, userId] }] }
    const res = {}
    let sales
    await executeQueries(req, res, (err) => {
        if (err) throw new Error(err)
        sales = req.results
    })
    return sales
}


const getById = async (id) => {
    const query = `
        SELECT
            s.id,
            s.purchaserId,
            u.user_name as purchaserName,
            u.proxyCreatorId,
            l.collectedItemId,
            l.bulkSplitId,
            l.lotId,
            s.time
        FROM V3_Sale s
        left join V3_Listing l on l.saleId = s.id
        LEFT JOIN users u
            ON u.user_id = s.purchaserId
        WHERE s.id = ?
    ;`
    const req = { queryQueue: [{ query, variables: [id] }] }
    const res = {}
    let sales
    await executeQueries(req, res, (err) => {
        if (err) throw err
        sales = req.results
    })
    return sales[0]
}

module.exports = { 
    findByUserId, 
    select,
    getById
}
