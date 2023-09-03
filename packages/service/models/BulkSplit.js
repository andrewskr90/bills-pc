const { executeQueries } = require("../db")

const findByUserId = async (userId) => {
    if (!userId) throw new Error(`Error: User ID required to find bulk splits collected by user.`)
    let query = `
        SELECT
            bulk_split_id,
            bulk_split_count,
            bulk_split_estimate,
            bulk_split_label_assignment_id,
            label_id,
            label_component_id,
            rarity_id,
            rarity_name,
            type_id,
            type_name,
            printing_id,
            printing_name,
            set_v2_id,
            set_v2_name,
            bulk_split_user_id
        FROM bulk_splits 
        RIGHT JOIN bulk_split_label_assignments on bulk_split_label_assignment_bulk_split_id = bulk_split_id
        LEFT JOIN labels on label_id = bulk_split_label_assignment_label_id
        RIGHT JOIN label_components on label_component_label_id = label_id
        LEFT JOIN rarities on rarity_id = label_component_rarity_id
        LEFT JOIN types on type_id = label_component_type_id
        LEFT JOIN printings on printing_id = label_component_printing_id
        LEFT JOIN sets_v2 on set_v2_id = label_component_set_v2_id
        WHERE bulk_split_user_id = '${userId}'
    ;`   
    const req = { queryQueue: [query] }
    const res = {}
    let bulkSplits
    await executeQueries(req, res, (err) => {
        if (err) throw new Error(err)
        bulkSplits = req.results
    })
    return bulkSplits
}

module.exports = { findByUserId }
