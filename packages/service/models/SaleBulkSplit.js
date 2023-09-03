const { executeQueries } = require("../db")
const { compileLabelComponentsIntoSplits } = require("../utils/bulk-splits")

const select = async (userId) => {
    if (!userId) throw new Error(`Error: User Id required to query for bulk splits within a sale.`)
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
            bulk_split_user_id,
            sale_bulk_split_id,
            sale_bulk_split_rate,
            sale_id,
            sale_seller_id,
            sale_purchaser_id,
            sale_date,
            sale_vendor,
            sale_subtotal,
            sale_discount,
            sale_shipping,
            sale_tax_amount,
            sale_tax_rate,
            sale_total
        FROM bulk_splits 
        RIGHT JOIN bulk_split_label_assignments on bulk_split_label_assignment_bulk_split_id = bulk_split_id
        LEFT JOIN labels on label_id = bulk_split_label_assignment_label_id
        RIGHT JOIN label_components on label_component_label_id = label_id
        LEFT JOIN rarities on rarity_id = label_component_rarity_id
        LEFT JOIN types on type_id = label_component_type_id
        LEFT JOIN printings on printing_id = label_component_printing_id
        LEFT JOIN sets_v2 on set_v2_id = label_component_set_v2_id
        LEFT JOIN sale_bulk_splits on sale_bulk_split_bulk_split_id = bulk_split_id
        LEFT JOIN sales on sale_id = sale_bulk_split_sale_id
        WHERE sale_purchaser_id = '${userId}'
            OR sale_seller_id = '${userId}'
    ;`
    const req = { queryQueue: [query] }
    const res = {}
    try {
        let saleBulkSplits
        await executeQueries(req, res, (err) => {
            if (err) throw new Error(err)
            saleBulkSplits = req.results
        })
        return compileLabelComponentsIntoSplits(saleBulkSplits)
    } catch (err) {
        throw err
    }
}

module.exports = { select }
