const { executeQueries } = require("../db")
const { v4: uuidV4 } = require('uuid')

const find = async () => {
    let query = `SELECT * FROM types;`
    const req = { queryQueue: [{ query, variables: [] }] }
    const res = {}
    let types
    await executeQueries(req, res, (err) => {
        if (err) throw new Error(err)
        types = req.results
    })
    return types
}

const create = async (type) => {
    type.type_id = uuidV4()
    let query = `INSERT INTO types (${Object.keys(type).join(', ')}) 
        VALUES (${Object.keys(type).map(key => {
            if (type[key] === null) return 'NULL'
            return `'${type[key]}'`
        }).join(', ')});
    `   
    const req = { queryQueue: [{ query, variables: [] }] }
    const res = {}
    let addedType

    await executeQueries(req, res, (err) => {
        if (err) throw new Error(err)
        addedType = req.results
    })
    return {
        id: type.type_id,
        ...addedType
    }
}

const update = async (type, id) => {
    delete type.created_date
    delete type.modified_date
    let query = `UPDATE types
        SET ${Object.keys(type).map(key => {
            if (type[key]) {
                return `${key} = '${type[key]}'`
            } else {
                return `${key} = NULL`
            }
        }).join(', ')}
        WHERE type_id = '${id}';
    `   
    const req = { queryQueue: [{ query, variables: [] }] }
    const res = {}

    await executeQueries(req, res, (err) => {
        if (err) throw new Error(err)
    })
    return {
        id
    }
}

const destroy = async (id) => {
    let query = `DELETE FROM types WHERE type_id = ?;`
    const req = { queryQueue: [{ query, variables: [id] }] }
    const res = {}

    await executeQueries(req, res, (err) => {
        if (err) throw new Error(err)
    })
    return {
        id
    }
}

module.exports = { find, create, update, destroy }
