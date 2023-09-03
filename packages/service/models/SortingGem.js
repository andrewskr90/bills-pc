const { executeQueries } = require("../db")
const { compileLabelComponentsIntoSplits } = require("../utils/bulk-splits")

const select = async (userId) => {
    if (!userId) throw new Error(`Error: User ID required to find bulk gems as a result of a sorting by a user.`)
    let query = `
        SELECT
            card_v2_id,
            collected_card_id,
            set_v2_id,
            sorting_gem_id,
            sorting_id,
            sorting_bulk_split_id,
            sorting_sorter_id,
            sorting_date
        FROM sorting_gems
        LEFT JOIN collected_cards ON collected_card_id = sorting_gem_collected_card_id
        LEFT JOIN cards_v2 on card_v2_id = collected_card_card_id
        LEFT JOIN sets_v2 on set_v2_id = card_v2_set_id
        LEFT JOIN sortings on sorting_id = sorting_gem_sorting_id
        WHERE sorting_sorter_id = '${userId}'
    ;`
    const req = { queryQueue: [query] }
    const res = {}
    try {
        let sortingGems
        await executeQueries(req, res, (err) => {
            if (err) throw new Error(err)
            sortingGems = req.results
        })
        return sortingGems
    } catch (err) {
        throw err
    }
}

module.exports = { select }
