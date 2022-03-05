const db = require('../data/dbconfig')

const find = () => {
    return db('sets')
}

const findById = (set_id) => {
    return db('sets').where({ set_id }).first()
}

function findBy(filter) {
    return db('sets').where(filter).orderBy("set_id");
  }

const add = async (set) => {
    const [set_id] = await db('sets').insert(set, 'set_id')
    return findById(set_id)
}

const update = async (set_id, changes) => {
    const [updated_set] = await db('sets').where({ set_id }).update(changes, '*')
    return updated_set
}

const remove = async (set_id) => {
    const [deleted_set] = await db('sets').delete().where({ set_id }).returning(['set_id','set_name'])
    return deleted_set
}

module.exports = {
    find,
    findById,
    findBy,
    add, 
    update,
    remove
}
