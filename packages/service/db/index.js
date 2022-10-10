const mysql = require('mysql2')
const config = require('../../../config')

const pool = mysql.createPool(config.MYSQL)

pool.on('connection', conn => {
    console.log('Pool successfully connected.')
})

const executeQueries = (req, res, next) => {
    if (req.queryQueue.length === 1) {
        // pool.query automatically releases connection afterward
        pool.query(req.queryQueue[0], (err, rows, fields) => {
            if (err) {
                return next(err)
            } else {
                req.results = rows
                return next()
            }
        })
    } else {
        // transactions must be manually released
        pool.getConnection((err, connection) => {
            if (err) {
                pool.releaseConnection(connection)
                return next(err)
            } else {
                connection.beginTransaction(err => {
                    if (err) {
                        pool.releaseConnection(connection)
                        return next(err)
                    } else {
                        req.queryQueue.forEach(query => {
                            connection.query(query, (err, results) => {
                                if (err) {
                                    connection.rollback(() => {
                                        pool.releaseConnection(connection)
                                        return next(err)
                                    })
                                } 
                            })
                        })
                        connection.commit(err => {
                            if (err) {
                                connection.rollback(() => {
                                    pool.releaseConnection(connection)
                                    return next(err)
                                })
                            } else {
                                pool.releaseConnection(connection)
                                return next()
                            }
                        })
                    }
                })
            }
        })
    }
}


module.exports = {
    pool,
    executeQueries
}
