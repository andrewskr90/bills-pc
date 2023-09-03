const { executeQueries } = require("../db")

const select = async (userId) => {
    if (!userId) throw new Error(`Error: User Id required to query for `)
    let query = `
        SELECT
            product_id,
            product_name,
            product_release_date,
            product_description,
            product_tcgplayer_product_id,
            collected_product_id,
            set_v2_id,
            sale_product_id,
            sale_product_price,
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
        FROM sale_products 
        LEFT JOIN collected_products ON collected_product_id = sale_product_collected_product_id
        LEFT JOIN products on product_id = collected_product_product_id
        LEFT JOIN sets_v2 on set_v2_id = product_set_id
        LEFT JOIN sales on sale_id = sale_product_sale_id
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
