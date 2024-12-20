const { executeQueries } = require("../db")
const { parseThenFormatLabels } = require("../middleware/collected-item-middleware")

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
        WHERE bulk_split_user_id = ?
    ;`   
    const req = { queryQueue: [{ query, variables: [userId] }] }
    const res = {}
    let bulkSplits
    await executeQueries(req, res, (err) => {
        if (err) throw new Error(err)
        bulkSplits = req.results
    })
    return bulkSplits
}

const getById = async (id) => {
    const query = `
        SELECT 
            bs1.id,
            bs1.count,
            bs1.estimate,
            GROUP_CONCAT(bsl.labelComponents SEPARATOR ',') as labels
        FROM V3_BulkSplit bs1
        LEFT JOIN (
            SELECT
                bsl.id as bulkSplitLabelId,
                bsl.bulkSplitId,
                GROUP_CONCAT(
                    '[', 
                    IFNULL(la.id, 'NULL'), ',',
                    IFNULL(lc.id, 'NULL'), ',',
                    IFNULL(lc.rarityId, 'NULL'), ',',
                    IFNULL(lc.typeId, 'NULL'), ',',
                    IFNULL(lc.printingid, 'NULL'), ',',
                    IFNULL(lc.setId, 'NULL'),
                    ']' SEPARATOR ','
                ) as labelComponents
            FROM V3_BulkSplitLabel bsl
            LEFT JOIN V3_Label la on la.id = bsl.labelId
            LEFT JOIN V3_LabelComponent lc on lc.labelId = la.id
            GROUP BY bsl.bulkSplitId
        ) bsl on bsl.bulkSplitId = bs1.id
        WHERE bs1.id = ?
        GROUP BY bs1.id
    `
    const queryQueue = [{ query, variables: [id] }]
    const req = { queryQueue }
    const res = {}
    let bulkSplitResults
    await executeQueries(req, res, (err) => {
        if (err) throw err
        bulkSplitResults = req.results[0]
    })
    return {
        ...bulkSplitResults,
        labels: bulkSplitResults.labels ? parseThenFormatLabels(bulkSplitResults.labels) : null
    }
}

module.exports = { findByUserId, getById }
