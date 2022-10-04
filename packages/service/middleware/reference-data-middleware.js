const formatReferenceData = (req, res, next) => {
    const sets = []
    const rarities = []
    req.results.forEach(result => {
        if (result.set_v2_id) sets.push({
            set_v2_id: result.set_v2_id,
            set_v2_name: result.set_v2_name
        })
        if (result.card_v2_rarity) rarities.push(result.card_v2_rarity)
    })
    req.results = {
        sets: sets,
        rarities: rarities
    }
    next()
}

module.exports = {
    formatReferenceData
}