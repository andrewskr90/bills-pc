const db = require('../data/dbconfig')

const find = () => {
    return db('rip_products')
}

const findById = (rip_product_id) => {
    return db('rip_products').where({ rip_product_id }).first()
}

function findBy(filter) {
    return db('rip_products').where(filter).orderBy("rip_product_id");
  }

const add = async (rip_product) => {
    const [rip_product_id] = await db('rip_products').insert(rip_product, 'rip_product_id')
    return findById(rip_product_id)
}

const update = async (rip_product_id, changes) => {
    const [updated_rip_product] = await db('rip_products').where({ rip_product_id }).update(changes, '*')
    return updated_rip_product
}

const remove = async (rip_product_id) => {
    const [deleted_rip_product] = await db('rip_products').delete().where({ rip_product_id }).returning(['rip_product_id','rip_product_rip_id','rip_product_product_id'])
    return deleted_rip_product
}

module.exports = {
    find,
    findById,
    findBy,
    add, 
    update,
    remove
}
