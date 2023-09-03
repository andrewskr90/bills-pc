const { executeQueries } = require("../db")
const { compileLabelComponentsIntoSplits } = require("../utils/bulk-splits")

const select = async (userId) => {
    if (!userId) throw new Error(`Error: User ID required to find bulk splits as a result of a sorting by a user.`)
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
            sorting_split_id,
            sorting_id,
            sorting_bulk_split_id,
            sorting_sorter_id,
            sorting_date
        FROM bulk_splits 
        RIGHT JOIN bulk_split_label_assignments on bulk_split_label_assignment_bulk_split_id = bulk_split_id
        LEFT JOIN labels on label_id = bulk_split_label_assignment_label_id
        RIGHT JOIN label_components on label_component_label_id = label_id
        LEFT JOIN rarities on rarity_id = label_component_rarity_id
        LEFT JOIN types on type_id = label_component_type_id
        LEFT JOIN printings on printing_id = label_component_printing_id
        LEFT JOIN sets_v2 on set_v2_id = label_component_set_v2_id
        LEFT JOIN sorting_splits on sorting_split_bulk_split_id = bulk_split_id
        LEFT JOIN sortings on sorting_id = sorting_split_sorting_id
        WHERE sorting_sorter_id = '${userId}'
    ;`
    const req = { queryQueue: [query] }
    const res = {}
    try {
        let sortingSplits
        await executeQueries(req, res, (err) => {
            if (err) throw new Error(err)
            sortingSplits = req.results
        })
        return compileLabelComponentsIntoSplits(sortingSplits)
    } catch (err) {
        throw err
    }
}

module.exports = { select }
