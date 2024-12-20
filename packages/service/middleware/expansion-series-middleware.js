const getExpansionSeries = async (req, res, next) => {
    const variables = []
    let query = `
        SELECT 
            set_v2_series
        FROM sets_v2
        WHERE set_v2_series IS NOT NULL
        GROUP BY set_v2_series
        ORDER BY set_v2_series
    `
    req.queryQueue.push({ query, variables })
    next()
}

module.exports = { getExpansionSeries }