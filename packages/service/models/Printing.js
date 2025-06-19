const { executeQueries } = require("../db")
const { v4: uuidV4 } = require('uuid')

const find = async () => {
    let query = `SELECT * FROM printings;`
    const req = { queryQueue: [{ query, variables: [] }] }
    const res = {}
    let printings
    await executeQueries(req, res, (err) => {
        if (err) throw new Error(err)
        printings = req.results
    })
    return printings
}

const create = async (printing) => {
    printing.printing_id = uuidV4()
    let query = `INSERT INTO printings (${Object.keys(printing).join(', ')}) 
        VALUES (${Object.keys(printing).map(key => {
            if (printing[key] === null) return 'NULL'
            return `'${printing[key]}'`
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
        id: printing.printing_id,
        ...addedType
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
    let query = `DELETE FROM printings WHERE printing_id = ?;`
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
