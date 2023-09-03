const QueryFormatters = require('../../../utils/queryFormatters')

const insert = (req, res, next) => {
    req.body.forEach(sale => {
        sale.bulkSplits.forEach(split => {
            const { sale_bulk_split_id, sale_bulk_split_rate, bulk_split_id } = split
            const query = QueryFormatters.objectsToInsert([{
                sale_bulk_split_id,
                sale_bulk_split_sale_id: sale.sale_id,
                sale_bulk_split_bulk_split_id: bulk_split_id,
                sale_bulk_split_rate
            }], 'sale_bulk_splits')
            req.queryQueue.push(`${query};`)
        })
    })
    next()
}

module.exports = {
    insert
}
