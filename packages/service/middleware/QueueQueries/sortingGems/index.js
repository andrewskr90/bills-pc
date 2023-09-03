const QueryFormatters = require('../../../utils/queryFormatters')

const insert = (req, res, next) => {
    req.body.forEach(transaction => {
        transaction.sortingGems.forEach(sortingGem => {
            console.log(sortingGem)
            const { sorting_gem_collected_card_id, sorting_gem_id, sorting_gem_sorting_id } = sortingGem
            const query = QueryFormatters.objectsToInsert([{
                sorting_gem_id, 
                sorting_gem_sorting_id, 
                sorting_gem_collected_card_id
            }], 'sorting_gems')
            req.queryQueue.push(`${query};`)
        })
    })
    next()
}

module.exports = {
    insert
}
