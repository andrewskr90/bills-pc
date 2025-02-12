const transactionRouter = require('express').Router()

const { verifyCookie, decodeSessionToken } = require('../../middleware/auth-middleware')
const { formatImportPurchase, formatImportGift, checkPurchaseBulkLabels } = require('../../middleware/sale-middleware')
const QueueQueries = require('../../middleware/QueueQueries')
const { executeQueries } = require('../../db')
const { getCollectedItemTransactions } = require('../../middleware/transaction-middleware')

transactionRouter.get('/collected-item/:id', 
    verifyCookie, 
    decodeSessionToken, 
    getCollectedItemTransactions,
    (req, res, next) => {
        res.status(200).json(req.results)
})

transactionRouter.get('/sales', 
    verifyCookie, 
    decodeSessionToken, 
    QueueQueries.init,
    // todo: remove saleId from query and add to route
    QueueQueries.sales.select,
    executeQueries,
    (req, res, next) => {
        res.status(200).json(req.results)
})

transactionRouter.post('/sales/import-purchase', 
    verifyCookie,
    decodeSessionToken,
    checkPurchaseBulkLabels,
    formatImportPurchase,
    QueueQueries.init,
    QueueQueries.collectedCards.insert,
    QueueQueries.collectedCardNotes.insert,
    QueueQueries.collectedProducts.insert,
    QueueQueries.collectedProductNotes.insert,
    QueueQueries.bulkSplits.insert,
    QueueQueries.sales.insert,
    QueueQueries.saleNotes.insert,
    QueueQueries.saleCards.insert,
    QueueQueries.saleProducts.insert,
    QueueQueries.saleBulkSplits.insert,
    executeQueries,
    (req, res, next) => {
        res.status(201).json(req.results)
})

transactionRouter.post('/gifts/import-gift', 
    verifyCookie,
    decodeSessionToken,
    formatImportGift,
    QueueQueries.init,
    QueueQueries.collectedCards.insert,
    QueueQueries.collectedCardNotes.insert,
    QueueQueries.collectedProducts.insert,
    QueueQueries.collectedProductNotes.insert,
    QueueQueries.gifts.insert,
    QueueQueries.giftNotes.insert,
    QueueQueries.giftCards.insert,
    QueueQueries.giftProducts.insert,
    executeQueries,
    (req, res, next) => {
        res.status(201).json(req.results)
})

module.exports = transactionRouter
