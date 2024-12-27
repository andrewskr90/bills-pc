const selectByItemId = (req, res, next) => {
    const variables = []
    let query = `
    SELECT 
        GROUP_CONCAT('[', '"', UNIX_TIMESTAMP(m.date), '"', ',', '"', m.price, '"', ']' ORDER BY m.date DESC) as prices,
        i.id,
        i.name,
        i.tcgpId,
        s.set_v2_id,
        s.set_v2_name,
        s.set_v2_ptcgio_id,
        s.set_v2_release_date,
        s.set_v2_series,
        c.condition_id,
        c.condition_name,
        p.printing_id,
        p.printing_name,
        p.printing_tcgp_printing_id
    FROM SKU
    LEFT JOIN MarketPrice as m
        ON m.skuId = SKU.id
    LEFT JOIN conditions c
        ON c.condition_id = SKU.conditionId
    LEFT JOIN printings p
        ON p.printing_id = SKU.printingId
    LEFT JOIN Item as i
        ON i.id = SKU.itemId
    LEFT JOIN sets_v2 as s
        ON  s.set_v2_id = i.setId
    WHERE i.id = ?
        AND (c.condition_id = '0655c457-ff60-11ee-b8b9-0efd996651a9' OR c.condition_id = '7e464ec6-0b23-11ef-b8b9-0efd996651a9')
    GROUP BY SKU.id
    ORDER BY i.name asc, p.printing_tcgp_printing_id, c.condition_tcgp_condition_id;`
    variables.push(req.params.item_id)
    req.queryQueue.push({ query, variables })
    next()
}

module.exports = {
    selectByItemId
}
