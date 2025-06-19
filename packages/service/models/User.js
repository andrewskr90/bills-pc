const { executeQueries } = require("../db")
const { v4: uuidV4 } = require('uuid')

const findProxyByCreatorId = async (req) => {
    let query = `
        SELECT
            *,
            count(*) OVER () as count
        FROM (
            SELECT
                u.user_id,
                u.user_name
            FROM users u
            WHERE u.proxyCreatorId = '${req.claims.user_id}'
            ${req.query.user_name ? `
                and u.user_name LIKE '%${req.query.user_name}%'
            ` : ''}
        ) as vendors
    `
    const variables = []
    const direction = req.query.direction ? req.query.direction.toLowerCase() : undefined 
    let orderBy = `ORDER BY user_name`
    if (direction && direction.toLowerCase() === 'desc') orderBy += ' DESC'
    else orderBy += ' ASC'
    query += orderBy
    const pageInt = parseInt(req.query.page)
    if (pageInt && pageInt > 0) {
        variables.push((pageInt-1)*20)
        query += ` LIMIT ?,20;`
    } else {
        query += ` LIMIT 0,20;`
    }
    const fakeReq = { queryQueue: [{ query: query, variables }] }
    const res = {}
    try {
        let vendors
        await executeQueries(fakeReq, res, (err) => {
            if (err) throw new Error(err)
            vendors = fakeReq.results
        })
        return vendors
    } catch (err) {
        throw err
    }
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
