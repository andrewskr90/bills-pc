const Transaction = require('../models/Transaction')
const LotEdit = require('../models/LotEdit')

const findMostRecentAcquirer = (transactions) => {
    for (let i=transactions.length-1; i>-1; i--) {
        const cur = transactions[i]
        if (cur.ownerId) return cur
    }
}

const createLotEdit = async (req, res, next) => {
    try {
        const { lotId, lotInserts, lotRemovals, time } = req.body 
        if (!time) {
            return next({ status: 400, message: 'Lot edit time required to update.' })
        }
        if (lotInserts.length === 0 && lotRemovals.length === 0) {
            return next({ status: 400, message: 'No items added to or deleted from lot.' })
        }
        const userId = req.claims.user_id
        const lotTransactions = await Transaction.getByLotId(lotId)
        const mostRecentAcquirer = findMostRecentAcquirer(lotTransactions)
        if (mostRecentAcquirer.ownerId !== userId && mostRecentAcquirer.proxyOwnerId !== userId) {
            return next({ status: 400, message: 'User does not have permission to update.' })
        }
        const lastLotTransaction = lotTransactions[lotTransactions.length-1]
        const lotEditTime = new Date(time)
        if (lastLotTransaction.time >= lotEditTime) {
            return next({ status: 400, message: 'Lot edits must occur sequentially.' })
        }
        const postedLotEdit = await LotEdit.createForExternal(req.body, mostRecentAcquirer.ownerId, userId)
        req.results = { createdId: postedLotEdit }
        next()
    } catch (err) {
        return next(err)
    }
}

module.exports = { createLotEdit }