const Transaction = require('../models/Transaction')
const LotEdit = require('../models/LotEdit')
const { previousOwner } = require('../models/Listing')

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
        const { collectedItemId, bulkSplitId, time: timeInQuestion } = lotTransactions[0]
        const { sellerId, ownerProxyCreatorId } = await previousOwner({ lotId, collectedItemId, bulkSplitId, time: timeInQuestion } , timeInQuestion)
        if (sellerId !== userId && ownerProxyCreatorId !== userId) {
            return next({ status: 400, message: 'User does not have permission to update.' })
        }
        const lastLotTransaction = lotTransactions[lotTransactions.length-1]
        const lotEditTime = new Date(time)
        if (lastLotTransaction.time >= lotEditTime) {
            return next({ status: 400, message: 'Lot edits must occur sequentially.' })
        }
        const postedLotEdit = await LotEdit.createForExternal(req.body, sellerId, userId)
        req.results = { createdId: postedLotEdit }
        next()
    } catch (err) {
        return next(err)
    }
}

const patchLotEdit = async (req, res, next) => {
    if (req.query.id) {
        const id = req.query.id
        req.results = await LotEdit.patchByFilter({ id }, req.body)
        next()
    } else {
        next({ status: 500, message: 'collectedItemId or lotId param is not present.' })
    }
}

const selectLotEdits = async (req, res, next) => {
    if (req.query.lotId) {
        const lotId = req.query.lotId
        req.results = await LotEdit.selectByFilter({ lotId })
        next()
    } else {
        next({ status: 500, message: 'no such route.' })
    }
}

module.exports = { createLotEdit, patchLotEdit, selectLotEdits }