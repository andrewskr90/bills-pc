const selectByUserId = (req, res, next) => {
    let query = `select * FROM (select 
        sale_card_id, null as sale_product_id, sale_card_price, null as sale_product_price,
        sale_id, sale_seller_id, sale_purchaser_id, sale_date, sale_vendor, sale_subtotal, sale_discount, sale_shipping, sale_tax_amount, sale_total,
        sale_note_id, sale_note_note,
        collected_card_id, null as collected_product_id, 
        collected_card_note_id, null as collected_product_note_id, collected_card_note_note, null as collected_product_note_note,
        card_v2_id, null as product_id, card_v2_name, null as product_name, card_v2_number, card_v2_rarity, card_v2_tcgplayer_product_id as tcgplayer_product_id, card_v2_foil_only
    from sale_cards 
        LEFT JOIN sales ON sale_card_sale_id = sale_id
        LEFT JOIN sale_notes ON sale_note_sale_id = sale_id AND sale_note_user_id = '${req.claims.user_id}'
        LEFT JOIN collected_cards ON sale_card_collected_card_id = collected_card_id
        LEFT JOIN collected_card_notes ON collected_card_note_collected_card_id = collected_card_id AND collected_card_note_user_id = '${req.claims.user_id}'
        LEFT JOIN cards_v2 ON card_v2_id = collected_card_card_id
    where sale_purchaser_id = '${req.claims.user_id}'
        OR sale_seller_id = '${req.claims.user_id}'
    UNION
    select 
        null as sale_card_id, sale_product_id, null as sale_card_price, sale_product_price,
        sale_id, sale_seller_id, sale_purchaser_id, sale_date, sale_vendor, sale_subtotal, sale_discount, sale_shipping, sale_tax_amount, sale_total,
        sale_note_id, sale_note_note,
        null as collected_card_id, collected_product_id,
        null as collected_card_note_id, collected_product_note_id, null as collected_card_note_note, collected_product_note_note,
        null as card_v2_id, product_id, null as card_v2_name, product_name, null as card_v2_number, null as card_v2_rarity, product_tcgplayer_product_id as tcgplayer_product_id, null as card_v2_foil_only
    from sale_products 
        LEFT JOIN sales ON sale_product_sale_id = sale_id
        LEFT JOIN sale_notes ON sale_note_sale_id = sale_id AND sale_note_user_id = '${req.claims.user_id}'
        LEFT JOIN collected_products ON sale_product_collected_product_id = collected_product_id
        LEFT JOIN collected_product_notes ON collected_product_note_collected_product_id = collected_product_id AND collected_product_note_user_id = '${req.claims.user_id}'
        LEFT JOIN products ON product_id = collected_product_product_id
    where sale_purchaser_id = '${req.claims.user_id}'
        OR sale_seller_id = '${req.claims.user_id}') as portfolio_results
    ORDER BY sale_date, sale_id`
    req.queryQueue.push({ query, variables: [] })
    next()
}

module.exports = { selectByUserId }
