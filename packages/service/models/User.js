const { executeQueries } = require("../db")
const { v4: uuidV4 } = require('uuid')

const findProxyByCreatorId = async (userId) => {
    let query = `SELECT * FROM users WHERE proxyCreatorId = ?;`
    const req = { queryQueue: [{ query, variables: [userId] }] }
    const res = {}
    let ProxyUsers
    await executeQueries(req, res, (err) => {
        if (err) throw new Error(err)
        ProxyUsers = req.results
    })
    return ProxyUsers
}

const createProxyUser = async (proxyUser) => {
    let query = `INSERT INTO users (${Object.keys(proxyUser).join(', ')}) 
        VALUES (${Object.keys(proxyUser).map(key => {
            if (proxyUser[key] === undefined || proxyUser[key] === null) return 'NULL'
            return `'${proxyUser[key]}'`
        }).join(', ')});
    `   
    const req = { queryQueue: [{ query, variables: [] }] }
    const res = {}
    let results

    await executeQueries(req, res, (err) => {
        if (err) throw new Error(err)
        results = req.results
    })
    return {
        id: proxyUser.user_id,
        ...results
    }
}

module.exports = { findProxyByCreatorId, createProxyUser }
