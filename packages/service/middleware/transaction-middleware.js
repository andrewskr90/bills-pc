const Transaction = require('../models/Transaction')

const getCollectedItemTransactions = async (req, res, next) => {
    const userId = req.claims.user_id
    const collectedItemId = req.params.id
    try {
        const transactions = await Transaction.getByCollectedCardIdNew(collectedItemId, userId)
        console.log(transactions)
        // let count = 0
        // let countedCollectedItems = false
        // req.results = {}
        // req.results.items = portfolio.map(item => {
        //     if (!countedCollectedItems) {
        //         if (item.count !== null) {
        //             count += parseInt(item.count)
        //             countedCollectedItems = true
        //         }
        //     }
        //     delete item.count
        //     return item
        // })
        // req.results.count = count
        req.results = transactions
        next()
    } catch (err) {
        next(err)
    }
    next()
}

module.exports = { getCollectedItemTransactions }