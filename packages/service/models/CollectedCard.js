const { executeQueries } = require("../db")

const findByUserId = async (userId) => {
    if (!userId) throw new Error(`Error: User Id required in order to query User's collected cards`)
    let query = `SELECT * FROM collected_cards WHERE collected_card_user_id = '${userId}';`   
    const req = { queryQueue: [query] }
    const res = {}
    let collectedCards
    await executeQueries(req, res, (err) => {
        if (err) throw new Error(err)
        collectedCards = req.results
    })
    return collectedCards
}

const findCurrent = async (userId) => {
    let query = `
        SELECT * FROM collected_cards
        LEFT JOIN sale_cards on sale_card_collected_card_id = collected_card_id
        LEFT JOIN
        
        WHERE sale_card_id IS NULL
    ;`
    const req = { queryQueue: [query] }
    const res = {}
    let currentCollectedCards
    await executeQueries(req, res, (err) => {
        if (err) throw new Error(err)
        currentCollectedCards = req.results
    })
    return currentCollectedCards
}

module.exports = { findByUserId, findCurrent }
