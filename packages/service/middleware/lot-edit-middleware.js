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
        if (!time) return next({ status: 400, message: 'Lot edit time required to update.' })
        const lotEditTime = new Date(time)
        if (lotInserts.length === 0 && lotRemovals.length === 0) return next({ status: 400, message: 'No items added to or deleted from lot.' })
        const userId = req.claims.user_id
        const lotTransactions = await Transaction.getByLotId(lotId)
        // const lotTransactionsWithItems = []
        // for (let i=0; i<lotTransactions.length; i++) {
        //     const curTransaction = lotTransactions[i]
        //     if (curTransaction.lotEditId) {
        //         const lotEditItems = await LotEdit.getById(curTransaction.lotEditId)
        //         lotTransactionsWithItems.push({
        //             ...curTransaction,
        //             lotInserts: lotEditItems.filter(i => i.lotInsertId).map(i => { 
        //                 const { 
        //                      insertedCollectedItemId: collectedItemId, bulkSplitId, index } = i
        //                 return { collectedItemId, bulkSplitId, index }
        //             }),
        //             lotRemovals: lotEditItems.filter(i => i.lotRemovalId).map(i => { 
        //                 const { removedCollectedItemId: collectedItemId, bulkSplitId } = i
        //                 return { collectedItemId, bulkSplitId }
        //             })
        //         })
        //     } else lotTransactionsWithItems.push(curTransaction)
        // }
        const sortedLotTransactions = lotTransactions.sort((a, b) => {
            if (a.time < b.time) return -1
            else if (a.time > b.time) return 1
            else {
                if (a.lotEditId) return -1
                if (a.giftId) {
                    if (b.lotEditId) return 1
                    if (b.listingId) return -1
                }
                if (a.listingId) return 1
            }
        })
        const mostRecentAcquirer = findMostRecentAcquirer(sortedLotTransactions)
        if (mostRecentAcquirer.ownerId !== userId && mostRecentAcquirer.proxyOwnerId !== userId) return next({ status: 400, message: 'User does not have permission to update.' })
        const lastLotTransaction = sortedLotTransactions[sortedLotTransactions.length-1]
        if (lastLotTransaction.time >= lotEditTime) return next({ status: 400, message: 'Lot edits must occur sequentially.' })
        const postedLotEdit = await LotEdit.createForExternal(req.body, mostRecentAcquirer.ownerId, userId)
        req.results = { createdId: postedLotEdit }
        next()
    } catch (err) {
        return next(err)
    }
}

module.exports = { createLotEdit }