const { executeQueries } = require("../db")

const findByUserId = async (userId) => {
    if (!userId) throw new Error(`Error: User Id required in order to query User's collected products`)
    let query = `SELECT * FROM collected_products WHERE collected_product_user_id = ?;`   
    const req = { queryQueue: [{ query, variables: [userId] }] }
    const res = {}
    let collectedProducts
    await executeQueries(req, res, (err) => {
        if (err) throw new Error(err)
        collectedProducts = req.results
    })
    return collectedProducts    
}

module.exports = { findByUserId }
