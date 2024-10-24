const QueryFormatters = require('../../../utils/queryFormatters')

const insert = (req, res, next) => {
    req.body.forEach(transaction => {
        transaction.bulkSplits.forEach(split => {
            const { bulk_split_id, bulk_split_count, bulk_split_estimate } = split
            const query = QueryFormatters.objectsToInsert([{
                bulk_split_id,
                bulk_split_count,
                bulk_split_estimate
            }], 'bulk_splits')
            req.queryQueue.push({ query: `${query};`, variables: [] })
            split.labels.forEach(label => {
                const { 
                    bulk_split_label_assignment_id, 
                    bulk_split_label_assignment_bulk_split_id,
                    bulk_split_label_assignment_label_id
                } = label
                    const query = QueryFormatters.objectsToInsert([{
                    bulk_split_label_assignment_id, 
                    bulk_split_label_assignment_bulk_split_id,
                    bulk_split_label_assignment_label_id
                }], 'bulk_split_label_assignments')
                req.queryQueue.push({ query: `${query};`, variables: [] })
            })
        })
    })
    next()
}

module.exports = { insert }