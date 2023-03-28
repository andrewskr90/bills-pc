const transactionRouter = require('express').Router()

const { verifyCookie, decodeSessionToken } = require('../../middleware/auth-middleware')
const { formatImportPurchase } = require('../../middleware/sale-middleware')
const QueueQueries = require('../../middleware/QueueQueries')
const { executeQueries } = require('../../db')

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
    formatImportPurchase,
    QueueQueries.init,
    QueueQueries.collectedCards.insert,
    QueueQueries.collectedCardNotes.insert,
    QueueQueries.collectedProducts.insert,
    QueueQueries.collectedProductNotes.insert,
    QueueQueries.sales.insert,
    QueueQueries.saleNotes.insert,
    QueueQueries.saleCards.insert,
    QueueQueries.saleProducts.insert,
    executeQueries,
    (req, res, next) => {
        res.status(201).json(req.results)
})

module.exports = transactionRouter