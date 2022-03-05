const db = require('../data/dbconfig')

const find = () => {
    return db('product_connections')
}

const findById = (product_connection_id) => {
    return db('product_connections').where({ product_connection_id }).first()
}

function findBy(filter) {
    return db('product_connections').where(filter).orderBy("product_connection_id");
  }

const add = async (product_connection) => {
    const [product_connection_id] = await db('product_connections').insert(product_connection, 'product_connection_id')
    return findById(product_connection_id)
}

const update = async (product_connection_id, changes) => {
    const [updated_product_connection] = await db('product_connections').where({ product_connection_id }).update(changes, '*')
    return updated_product_connection
}

const remove = async (product_connection_id) => {
    const [deleted_product_connection] = await db('product_connections').delete().where({ product_connection_id }).returning('product_connection_id')
    return deleted_product_connection
}

module.exports = {
    find,
    findById,
    findBy,
    add, 
    update,
    remove
}
