const connection = require('..')
const { addCollectedCardsMySQL } = require('./collectedCardQueries')
const { addSalesMySQL } = require('./saleQueries')
const { addSaleCardsMySQL } = require('./saleCardQueries')
const { addSaleNotesMySQL } = require('./saleNoteQueries')
const { addCollectedCardNotesMySQL } = require('./collectedCardNoteQueries')

const findTransactionSalesMySQL = async (req, res, next) => {
    //if request is for specific sale_id
    if (req.query.sale_id) {
        const queryString = `SELECT * FROM sales 
            LEFT JOIN sale_cards ON sales.sale_id = sale_cards.sale_card_sale_id
            LEFT JOIN collected_cards ON collected_cards.collected_card_id = sale_cards.sale_card_collected_card_id
            LEFT JOIN cards ON cards.card_id = collected_cards.collected_card_card_id
            LEFT JOIN sale_notes ON sale_note_sale_id = sale_id 
                WHERE sale_id='${req.query.sale_id}' 
                    AND sale_purchaser_id='${req.claims.user_id}' 
                    AND (sale_note_user_id='${req.claims.user_id}' OR sale_note_user_id IS NULL);`
        const query= new Promise((resolve, reject) => {
            connection.query(queryString, (err, results) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(results)
                }
            })
        })
        try {
            req.results = await query
            return next()
        } catch (err) {
            return next(err)
        }
    }
}

const addTransactionSalesMySQL = async (req, res, next) => {
    const saleTransaction = new Promise((resolve, reject) => {
        connection.beginTransaction(async (err) => {
            try {
                await addCollectedCardsMySQL(req, res, (err) => {
                    if (err) {
                        connection.rollback()
                        throw new Error(err)
                    }
                })
                await addCollectedCardNotesMySQL(req, res, (err) => {
                    if (err) {
                        connection.rollback()
                        throw new Error(err)
                    }
                })
                await addSalesMySQL(req, res, (err) => {
                    if (err) {
                        connection.rollback()
                        throw new Error(err)
                    }
                })
                await addSaleCardsMySQL(req, res, (err) => {
                    if (err) {
                        connection.rollback()
                        throw new Error(err)
                    }
                })
                await addSaleNotesMySQL(req, res, (err) => {
                    if (err) {
                        connection.rollback()
                        throw new Error(err)
                    }
                })
                resolve({
                    message: 'success'
                })
            } catch(err) {
                reject(err)
            }
        })
    })
    try {
        const transactionResults = await saleTransaction
        req.results = transactionResults
        next()
    } catch (err) {
        return next(err)
    }
}

module.exports = {
    addTransactionSalesMySQL,
    findTransactionSalesMySQL
}