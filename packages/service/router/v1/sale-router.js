const saleRouter = require('express').Router()
const { verifySession, decodeJwt } = require('../../middleware/auth-middleware')
const { 
    checkSaleType,
    formatSales,
    formatSaleNotes,
    formatCollectedCards,
    formatCollectedCardNotes,
    formatSaleCards,
    compileSaleResults
} = require('../../middleware/sale-middleware')
const { addCollectedCardsMySQL } = require('../../db/queries/collectedCardQueries')
const { addSalesMySQL, findSalesMySQL } = require('../../db/queries/saleQueries')
const { addSaleCardsMySQL } = require('../../db/queries/saleCardQueries')
const { addSaleNotesMySQL } = require('../../db/queries/saleNoteQueries')
const { addCollectedCardNotesMySQL } = require('../../db/queries/collectedCardNoteQueries')

saleRouter.get('/', verifySession, decodeJwt, findSalesMySQL, (req, res, next) => {
    res.status(200).json(req.results)
})

saleRouter.post('/', 
    verifySession,
    decodeJwt,
    checkSaleType,
    formatSales,
    formatSaleNotes,
    formatCollectedCards,
    formatCollectedCardNotes,
    formatSaleCards,
    addCollectedCardsMySQL,
    addCollectedCardNotesMySQL,
    addSalesMySQL,
    addSaleCardsMySQL,
    addSaleNotesMySQL,
    compileSaleResults,
    (req, res, next) => {
        res.status(200).json(req.results)
})

module.exports = saleRouter
