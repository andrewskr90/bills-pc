const testSets = [
    { set_v2_id: '0', set_v2_name: 'Test Set 0', set_v2_tcgplayer_set_id: '0' }
]
const testItems = [
    { id: '0', name: 'Test Item 0', setId: testSets[0].set_v2_id, tcgpId: '0' }
]
const testPrintings = [
    { printing_id: '0', printing_name: 'Test Printing 0', printing_tcgp_printing_id: '0' },
    { printing_id: '1', printing_name: 'Test Printing 1', printing_tcgp_printing_id: '1' },
    { printing_id: '2', printing_name: 'Test Printing 2', printing_tcgp_printing_id: '2' }
]
const testConditions = [
    { condition_id: '0', condition_name: 'Test Condition 0', condition_tcgp_condition_id: '0' },
    { condition_id: '1', condition_name: 'Test Condition 1', condition_tcgp_condition_id: '1' },
    { condition_id: '2', condition_name: 'Test Condition 2', condition_tcgp_condition_id: '2' }
]

const executeQueryQueue = async (queryQueue, connection) => {
    for (let i=0; i<queryQueue.length; i++) {
        const { query, variables } = queryQueue[i]
        await connection.query(query, variables)
    }
}

module.exports = {
    testSets,
    testItems,
    testPrintings,
    testConditions,
    executeQueryQueue
}