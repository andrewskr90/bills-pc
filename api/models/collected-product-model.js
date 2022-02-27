const db = require('../data/dbconfig')

const find = () => {
    return db('collected_products')
}

const findById = (collected_product_id) => {
    return db('collected_products').where({ collected_product_id }).first()
}

function findBy(filter) {
    return db('collected_products').where(filter).orderBy("collected_product_id");
  }

const add = async (collected_product) => {
    const [collected_product_id] = await db('collected_products').insert(collected_product, 'collected_product_id')
    return findById(collected_product_id)
}

const update = async (collected_product_id, changes) => {
    const [updated_collected_product] = await db('collected_products').where({ collected_product_id }).update(changes, '*')
    return updated_collected_product
}

const remove = async (collected_product_id) => {
    const [deleted_collected_product] = await db('collected_products').delete().where({ collected_product_id }).returning(['collected_product_id','collected_product_product_id'])
    return deleted_collected_product
}

module.exports = {
    find,
    findById,
    findBy,
    add, 
    update,
    remove
}
