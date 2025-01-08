const Transaction = require('../models/Transaction')
const CollectedItem = require('../models/CollectedItem')
const Condition = require('../models/Condition')
const Printing = require('../models/Printing')

const getCollectedItemTransactions = async (req, res, next) => {
    const userId = req.claims.user_id
    const collectedItemId = req.params.id
    try {
        const collecteItemInfo = await CollectedItem.getById(collectedItemId)
        const transactions = await Transaction.getByCollectedCardIdNew(collectedItemId, userId)
        const conditions = await Condition.find()
        const printings = await Printing.find()
        // TODO only return acquisition transaction and current state. With count of transactions between
        // TODO filter transactions based on user permissions (only transactions they participated in)
        req.results = {
            ...collecteItemInfo,
            conditionName: conditions.find(condition => condition.condition_id === collecteItemInfo.appraisals[0][1]).condition_name,
            printingName: printings.find(printing => printing.printing_id === collecteItemInfo.printingId).printing_name,
            transactions
        }
        next()
    } catch (err) {
        next(err)
    }
    next()
}

module.exports = { getCollectedItemTransactions }