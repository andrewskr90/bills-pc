const mysql = require('mysql2/promise')
const config = require('../../config')
const { testSets, testItems, testPrintings, testConditions } = require('./test')
const QueryFormatters = require('./utils/queryFormatters')
const testPool = mysql.createPool(config.MYSQL.test)

const setup = async (globalConfig, projectConfig) => {
    await testPool.on('connection', conn => {
        console.log('Test pool successfully connected.')
    })
    const queryQueue = [
        QueryFormatters.objectsToInsert(testSets, 'sets_v2'),
        QueryFormatters.objectsToInsert(testItems, 'Item'),
        QueryFormatters.objectsToInsert(testPrintings, 'printings'),
        QueryFormatters.objectsToInsert(testConditions, 'conditions')
    ]
    
    const connection = await testPool.getConnection()
    queryQueue.forEach(async (query) => {
        await connection.query(query)
    })
    await connection.release(function (err) {
        if (err) throw err;
    })

    globalThis.testPool = testPool
}

module.exports = setup