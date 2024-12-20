const QueryFormatters = require('../../../utils/queryFormatters')

const insert = (req, res, next) => {
    const collectedProducts = req.collectedProducts
    if (collectedProducts.length > 0) {
        const query = QueryFormatters.objectsToInsert(collectedProducts, 'collected_products')
        req.queryQueue.push({ query: `${query};`, variables: [] })
    }
    next()
}

const select = (req, res, next) => {
    req.query.collected_product_user_id = req.claims.user_id
    let whereClause = `WHERE ${QueryFormatters.filterConcatinated(req.query)}`
    let query = `SELECT * FROM products 
        RIGHT JOIN collected_products ON products.product_id = collected_products.collected_product_product_id
        LEFT JOIN sets_v2 ON products.product_set_id = sets_v2.set_v2_id 
        LEFT JOIN sale_products ON sale_products.sale_product_collected_product_id = collected_product_id 
        LEFT JOIN collected_product_notes ON collected_product_note_collected_product_id = collected_product_id
        ${whereClause}`
    req.queryQueue.push({ query, variables: [] })
    next()
}

module.exports = {
    insert,
    select
}
