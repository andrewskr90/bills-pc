const bulkSplitRouter = require('express').Router()
const { verifyCookie, decodeSessionToken } = require('../../middleware/auth-middleware')
const { formatBulkSplits } = require('../../utils/bulk-splits')
const BulkSplit = require('../../models/BulkSplit')

bulkSplitRouter.get('/',
    verifyCookie,
    decodeSessionToken,
    async (req, res, next) => {
        try {
            let bulkSplits = await BulkSplit.findByUserId(req.claims.user_id)
            bulkSplits = formatBulkSplits(bulkSplits)
            res.status(200).json(bulkSplits)
        } catch (err) {
            next(err)
        }
})

module.exports = bulkSplitRouter
