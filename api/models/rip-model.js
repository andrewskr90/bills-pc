const db = require('../data/dbconfig')

const find = () => {
    return db('rips')
}

const findById = (rip_id) => {
    return db('rips').where({ rip_id }).first()
}

function findBy(filter) {
    return db('rips').where(filter).orderBy("rip_id");
  }

const add = async (rip) => {
    const [rip_id] = await db('rips').insert(rip, 'rip_id')
    return findById(rip_id)
}

const update = async (rip_id, changes) => {
    const [updated_rip] = await db('rips').where({ rip_id }).update(changes, '*')
    return updated_rip
}

const remove = async (rip_id) => {
    const [deleted_rip] = await db('rips').delete().where({ rip_id }).returning(['rip_id','rip_collected_product_id'])
    return deleted_rip
}

module.exports = {
    find,
    findById,
    findBy,
    add, 
    update,
    remove
}
