const { testConditions, testPrintings, testItems, testSets } = require("./test")

const teardown = async (globalConfig, projectConfig) => {
    const testPool = globalThis.testPool
    const connection = await testPool.getConnection()
    
    const deleteConditions = `
        DELETE FROM conditions 
        where ${testConditions.map((condition, idx) => {
            let statement = ''
            if (idx > 0) statement += 'OR '
            statement += ` condition_id = '${condition.condition_id}'`
            return statement
        }).join(' ')};
    `
    const deletePrintings = `
        DELETE FROM printings 
        where ${testPrintings.map((printing, idx) => {
            let statement = ''
            if (idx > 0) statement += 'OR '
            statement += ` printing_id = '${printing.printing_id}'`
            return statement
        }).join(' ')};
    `
    const deleteItems = `
        DELETE FROM Item
        WHERE ${testItems.map((item, idx) => {
            let statement = ''
            if (idx > 0) statement += 'OR '
            statement += ` id = '${item.id}'`
            return statement
        }).join(' ')};
    `
    const deleteSets = `
        DELETE FROM sets_v2
        where ${testSets.map((set, idx) => {
            let statement = ''
            if (idx > 0) statement += 'OR '
            statement += ` set_v2_id = '${set.set_v2_id}'`
            return statement
        }).join(' ')};
    `
    await connection.query(deleteConditions)
    await connection.query(deletePrintings)
    await connection.query(deleteItems)
    await connection.query(deleteSets)
    await testPool.end(function (err) {
        if (err) throw err;
    });
}

module.exports = teardown