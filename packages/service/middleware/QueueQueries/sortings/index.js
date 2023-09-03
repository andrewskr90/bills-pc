const QueryFormatters = require('../../../utils/queryFormatters')

const insert = (req, res, next) => {
    req.body.forEach(sorting => {
        const { sorting_id, sorting_date, sorting_bulk_split_id } = sorting
        const query = QueryFormatters.objectsToInsert([
            { sorting_id, sorting_date, sorting_bulk_split_id, sorting_sorter_id: req.claims.user_id }
        ], 'sortings')
        req.queryQueue.push(`${query};`)
    })
    next()
}

module.exports = { insert }