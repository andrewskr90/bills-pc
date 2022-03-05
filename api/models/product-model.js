const db = require('../data/dbconfig')

const find = () => {
    return db('products')
}

const findById = (product_id) => {
    return db('products').where({ product_id }).first()
}

function findBy(filter) {
    return db('products').where(filter).orderBy("product_id");
  }

const add = async (product) => {
    const [product_id] = await db('products').insert(product, 'product_id')
    return findById(product_id)
}

const update = async (product_id, changes) => {
    const [updated_product] = await db('products').where({ product_id }).update(changes, '*')
    return updated_product
}

const remove = async (product_id) => {
    const [deleted_product] = await db('products').delete().where({ product_id }).returning(['product_id','product_name'])
    return deleted_product
}

module.exports = {
    find,
    findById,
    findBy,
    add, 
    update,
    remove
}
