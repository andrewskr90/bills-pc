const QueryFormatters = require('../../../utils/queryFormatters')

const insert = (req, res, next) => {
    const saleProducts = req.saleProducts
    if (saleProducts.length > 0) {
        const query = QueryFormatters.objectsToInsert(saleProducts, 'sale_products')
        req.queryQueue.push({ query: `${query};`, variables: [] })
    }
    next()
}

module.exports = {
    insert
}
