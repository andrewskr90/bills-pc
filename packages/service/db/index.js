const mysql = require('mysql2')
const config = require('../../../config')

const pool = mysql.createPool(config.MYSQL)

pool.on('connection', conn => {
    console.log('Pool successfully connected.')
})

const executeQueries = (req, res, next) => {
    if (req.queryQueue.length === 1) {
        pool.getConnection((err, connection) => {
            if (err) {
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
        })
    } else {
        pool.getConnection((err, connection) => {
            if (err) {
                return next(err)
            }
            connection.beginTransaction(err => {
                if (err) {
                    connection.release()
                    return next(err)
                } else {
                    try {
                        req.queryQueue.forEach(query => {
                            connection.query(query, (err, results) => {
                                if (err) {
                                    throw Error(err)
                                } 
                            })
                        })
                        connection.commit(err => {
                            if (err) {
                                throw Error(err)
                            } else {
                                connection.release()
                                return next()
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
        })
    }
}


module.exports = {
    pool,
    executeQueries
}
