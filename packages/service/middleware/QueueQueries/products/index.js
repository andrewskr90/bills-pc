const QueryFormatters = require('../../../utils/queryFormatters')

const insert = (req, res, next) => {
    const products = req.products
    const query = QueryFormatters.objectsToInsert(products, 'products')
    req.queryQueue.push(query)
    next()
}

const select = (req, res, next) => {
    const setId = req.query.product_set_id
    const query = `SELECT * FROM products WHERE product_set_id = '${setId}'`
    req.queryQueue.push(query)
    next()
}

module.exports = {
    insert,
    select
}
