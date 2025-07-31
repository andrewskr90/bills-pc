const { v4: uuidV4 } = require('uuid')
const { executeQueries } = require('../db')

const create = async (appraisal, userId) => {
    const id = uuidV4()
    const {
        collectedItemId,
        conditionId,
        time
    } = appraisal
    const query = `
        INSERT INTO V3_Appraisal
        (id,
        collectedItemId,
        conditionId,
        appraiserId,
        time)
        VALUES
        ('${id}',
        '${collectedItemId}',
        '${conditionId}',
        '${userId}',
        '${time}');
    `
    const variables = []
    const fakeReq = { queryQueue: [{ query: query, variables }] }
    const res = {}
    try {
        await executeQueries(fakeReq, res, (err) => {
            if (err) throw new Error(err)
        })
        return id
    } catch (err) {
        throw err
    }
}

module.exports = { create }