const mysql = require('mysql2')
const config = require('../../../config')

const pool = mysql.createPool(config.MYSQL)

const executeQueries = (req, res, next) => {
    if (req.queryQueue.length === 1) {
        pool.getConnection((err, connection) => {
            if (err) {
                connection.release()
                return next(err)
            }
            connection.query(req.queryQueue[0], (err, results) => {
                if (err) {
                    connection.release()
                    return next(err)
                }
                if (!err) {
                    req.results = results
                    connection.release()
                    return next()
                }
            })
            connection.on('error', (err) => {
                connection.release()
                return next(err)
            })
        })
    } else {
        pool.getConnection((err, connection) => {
            if (err) {
                connection.release()
                return next(err)
            }
            try {
                connection.beginTransaction(err => {
                    if (err) {
                        throw Error(err)
                    } else {
                        try {
                            req.queryQueue.forEach(query => {
                                connection.query(query, (err, results) => {
                                    if (err) {
                                        throw Error(err)
                                    } 
                                    console.log(results)
                                })
                            })
                            connection.commit(err => {
                                if (err) {
                                    throw Error(err)
                                } else {
                                    connection.release()
                                    next()
                                }
                            })
                        } catch (err) {
                            connection.rollback(() => {
                                connection.release()
                                return next(err)
                            })
                        }
                    }
                })
            } catch (err) {
                next(err)
            }
        })
    }
}


module.exports = {
    pool,
    executeQueries
}
