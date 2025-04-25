const mysql = require('mysql2/promise')
const config = require('../../../config')
const pool = mysql.createPool(config.MYSQL.production)

pool.on('connection', conn => {
    console.log('Pool successfully connected.')
})
// TODO received error before server went down: Warning: got packets out of order. Expected 21 but received 0
// look into connections not being closed, or connections failing after the server has been idle for a while
const executeQueries = async (req, res, next) => {
    if (req.queryQueue.length === 0) {
        next({ message: 'No queries added to Query Queue'})
    } else if (req.queryQueue.length === 1) {
        const connection = await pool.getConnection()
        try {
            // mysql2/promise queries return an array: [rows, fields]
            const { query, variables } = req.queryQueue[0]
            const [rows, fields] = await connection.query(query, variables)
            req.results = rows
            await connection.release()
            next()
        } catch (err) {
            await connection.release()
            next(err)
        }
    } else if (req.queryQueue.length > 1) {
        // mysql2/promise does not support callbacks
        const connection = await pool.getConnection()
        try {
            await connection.query('START TRANSACTION')
            for (let i=0; i<req.queryQueue.length; i++) {
                const { query, variables } = req.queryQueue[i]
                const [rows, fields] = await connection.query(query, variables)
            }
            await connection.commit()
            await connection.release()
            next()
        } catch (err) {
            await connection.rollback()
            await connection.release()
            next(err)
        }
    }
}


module.exports = {
    pool,
    executeQueries
}
