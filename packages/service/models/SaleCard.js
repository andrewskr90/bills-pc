const { executeQueries } = require("../db")

const select = async (userId) => {
    if (!userId) throw new Error(`Error: User Id required to query for `)
    let query = `
        SELECT
            card_v2_id,
            card_v2_name,
            card_v2_number,
            card_v2_rarity,
            card_v2_foil_only,
            collected_card_id,
            set_v2_id,
            sale_card_id,
            sale_card_price,
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
        FROM sale_cards
        LEFT JOIN collected_cards ON collected_card_id = sale_card_collected_card_id
        LEFT JOIN cards_v2 on card_v2_id = collected_card_card_id
        LEFT JOIN sets_v2 on set_v2_id = card_v2_set_id
        LEFT JOIN sales on sale_id = sale_card_sale_id
        WHERE sale_purchaser_id = '${userId}'
            OR sale_seller_id = '${userId}'
    ;`
    const req = { queryQueue: [query] }
    const res = {}
    try {
        let saleProducts
        await executeQueries(req, res, (err) => {
            if (err) throw new Error(err)
            saleProducts = req.results
        })
        return saleProducts
    } catch (err) {
        throw err
    }
}

module.exports = { select }
