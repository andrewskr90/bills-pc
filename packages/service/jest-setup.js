const mysql = require('mysql2/promise')
const config = require('../../config')
const testPool = mysql.createPool(config.MYSQL.test)

const setup = async (globalConfig, projectConfig) => {
    await testPool.on('connection', conn => {
        console.log('Test pool successfully connected.')
    })
    
    globalThis.testPool = testPool
}

module.exports = setup