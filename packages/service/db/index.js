const mysql = require('mysql2')
const config = require('../../../config')

const createConnection = () => {
    return mysql.createConnection(config.MYSQL)
}

module.exports = createConnection
