const QueryFormatters = require('../../../utils/queryFormatters')

const insert = (req, res, next) => {
    const giftProducts = req.giftProducts
    if (giftProducts.length > 0) {
        const query = QueryFormatters.objectsToInsert(giftProducts, 'gift_products')
        req.queryQueue.push({ query: `${query};`, variables: [] })
    }
    next()
}

module.exports = {
    insert
}
