const mysql = require('mysql2')
const config = require('../../../config')


const connection = mysql.createConnection(config.MYSQL)
connection.connect(err => {
    if (err) {
        console.log(err)
    } else {
        console.log('Successfully connected.')
    }
})

module.exports = connection
