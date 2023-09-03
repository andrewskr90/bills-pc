const QueryFormatters = require('../../../utils/queryFormatters')

const insert = (req, res, next) => {
    req.body.forEach(transaction => {
        transaction.sortingSplits.forEach(sortingSplit => {
            const { sorting_split_bulk_split_id, sorting_split_id, sorting_split_sorting_id } = sortingSplit
            const query = QueryFormatters.objectsToInsert([{
                sorting_split_bulk_split_id, 
                sorting_split_id, 
                sorting_split_sorting_id
            }], 'sorting_splits')
            req.queryQueue.push(`${query};`)
        })
    })
    next()
}

module.exports = {
    insert
}
