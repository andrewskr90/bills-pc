const transactionRouter = require('express').Router()

const { verifyCookie, decodeSessionToken } = require('../../middleware/auth-middleware')
const { 
    checkSaleType,
    formatSales,
    formatSaleNotes,
    formatCollectedCards,
    formatCollectedCardNotes,
    formatSaleCards
} = require('../../middleware/sale-middleware')
const { addTransactionSalesMySQL, findTransactionSalesMySQL } = require('../../db/queries/transactionQueries')
const QueueQueries = require('../../middleware/QueueQueries')
const { executeQueries } = require('../../db')

transactionRouter.get('/sales', 
    verifyCookie, 
    decodeSessionToken, 
    QueueQueries.init,
    QueueQueries.sales.select,
    executeQueries,
    // findTransactionSalesMySQL, 
    (req, res, next) => {
        res.status(200).json(req.results)
})

transactionRouter.post('/sales', 
    verifyCookie,
    decodeSessionToken,
    checkSaleType,
    formatSales,
    formatSaleNotes,
    formatCollectedCards,
    formatCollectedCardNotes,
    formatSaleCards,
    QueueQueries.init,
    QueueQueries.collectedCards.insert,
    QueueQueries.collectedCardNotes.insert,
    QueueQueries.sales.insert,
    QueueQueries.saleCards.insert,
    QueueQueries.saleNotes.insert,
    executeQueries,
    // addTransactionSalesMySQL,
    (req, res, next) => {
        res.status(201).json(req.results)
})

module.exports = transactionRouter