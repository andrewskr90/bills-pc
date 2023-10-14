const { executeQueries } = require("../db")
const { v4: uuidV4 } = require('uuid')

const findByUserId = async (userId) => {
    let query = `SELECT * FROM ProxyUser WHERE creatorId = '${userId}';`
    const req = { queryQueue: [query] }
    const res = {}
    let ProxyUsers
    await executeQueries(req, res, (err) => {
        if (err) throw new Error(err)
        ProxyUsers = req.results
    })
    return ProxyUsers
}

const create = async (proxyUser) => {
    let query = `INSERT INTO ProxyUser (${Object.keys(proxyUser).join(', ')}) 
        VALUES (${Object.keys(proxyUser).map(key => {
            if (proxyUser[key] === undefined) return 'NULL'
            return `'${proxyUser[key]}'`
        }).join(', ')});
    `   
    const req = { queryQueue: [query] }
    const res = {}
    let results

    await executeQueries(req, res, (err) => {
        if (err) throw new Error(err)
        results = req.results
    })
    return {
        id: proxyUser.id,
        ...results
    }
}

const update = async (printing, id) => {
    delete printing.created_date
    delete printing.modified_date
    let query = `UPDATE printings
        SET ${Object.keys(printing).map(key => {
            if (printing[key]) {
                return `${key} = '${printing[key]}'`
            } else {
                return `${key} = NULL`
            }
        }).join(', ')}
        WHERE printing_id = '${id}';
    `   
    const req = { queryQueue: [query] }
    const res = {}

    await executeQueries(req, res, (err) => {
        if (err) throw new Error(err)
    })
    return {
        id
    }
}

const destroy = async (id) => {
    let query = `DELETE FROM printings WHERE printing_id = '${id}';`
    const req = { queryQueue: [query] }
    const res = {}

    await executeQueries(req, res, (err) => {
        if (err) throw new Error(err)
    })
    return {
        id
    }
}

module.exports = { findByUserId, create, update, destroy }
