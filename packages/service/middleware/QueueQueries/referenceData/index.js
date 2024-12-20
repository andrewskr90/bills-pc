const select = (req, res, next) => {
    const query = `SELECT set_v2_id, set_v2_name, NULL as card_v2_rarity FROM sets_v2
    UNION
    SELECT NULL AS set_v2_id, NULL as set_v2_name, card_v2_rarity FROM cards_v2 ORDER BY set_v2_name, card_v2_rarity`
    req.queryQueue.push({ query, variables: []})
    next()
}

module.exports = {
    select
}