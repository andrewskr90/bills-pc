const QueryFormatters = require('../../../utils/queryFormatters')

const insert = (req, res, next) => {
    const products = req.products
    const query = QueryFormatters.objectsToInsert(products, 'products')
    req.queryQueue.push({ query, variables: [] })
    next()
}

const select = (req, res, next) => {
    let query
    if (Object.keys(req.query).length > 0) {
        if (req.query.product_id) {
            query = `SELECT * FROM products WHERE product_id = '${req.query.product_id}';`
        } else {
            const setId = req.query.product_set_id
            query = `SELECT * FROM products WHERE product_set_id = '${setId}'`
        }
    } else {
        query = 'SELECT * FROM products;'
    }
    req.queryQueue.push({ query, variables: [] })
    next()
}

module.exports = {
    insert,
    select
}
