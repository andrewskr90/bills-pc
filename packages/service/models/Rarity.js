const { executeQueries } = require("../db")
const { v4: uuidV4 } = require('uuid')

const find = async () => {
    let query = `SELECT * FROM rarities`
    const req = { queryQueue: [query] }
    const res = {}
    let rarities
    await executeQueries(req, res, (err) => {
        if (err) throw new Error(err)
        rarities = req.results
    })
    return rarities
}

const create = async (rarity) => {
    rarity.rarity_id = uuidV4()
    let query = `INSERT INTO rarities (${Object.keys(rarity).join(', ')}) 
        VALUES (${Object.keys(rarity).map(key => {
            if (rarity[key] === null) return 'NULL'
            return `'${rarity[key]}'`
        }).join(', ')});
    `   
    const req = { queryQueue: [query] }
    const res = {}
    let addedRarity

    await executeQueries(req, res, (err) => {
        if (err) throw new Error(err)
        addedRarity = req.results
    })
    return {
        id: rarity.rarity_id,
        ...addedRarity
    }
}

const update = async (rarity, id) => {
    delete rarity.created_date
    delete rarity.modified_date
    let query = `UPDATE rarities
        SET ${Object.keys(rarity).map(key => {
            if (rarity[key]) {
                return `${key} = '${rarity[key]}'`
            } else {
                return `${key} = NULL`
            }
        }).join(', ')}
        WHERE rarity_id = '${id}';
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
    let query = `DELETE FROM rarities WHERE rarity_id = '${id}';`
    const req = { queryQueue: [query] }
    const res = {}

    await executeQueries(req, res, (err) => {
        if (err) throw new Error(err)
    })
    return {
        id
    }
}

module.exports = { find, create, update, destroy }
