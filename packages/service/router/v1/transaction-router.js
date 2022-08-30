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

transactionRouter.get('/sales', verifyCookie, decodeSessionToken, findTransactionSalesMySQL, (req, res, next) => {
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
    addTransactionSalesMySQL,
    (req, res, next) => {
        res.status(201).json(req.results)
})

module.exports = transactionRouter