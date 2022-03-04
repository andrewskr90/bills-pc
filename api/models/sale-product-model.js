const db = require('../data/dbconfig')

const find = () => {
    return db('sale_products')
}

const findById = (sale_product_id) => {
    return db('sale_products').where({ sale_product_id }).first()
}

function findBy(filter) {
    return db('sale_products').where(filter).orderBy("sale_product_id");
  }

const add = async (sale_product) => {
    const [sale_product_id] = await db('sale_products').insert(sale_product, 'sale_product_id')
    return findById(sale_product_id)
}

const update = async (sale_product_id, changes) => {
    const [updated_sale_product] = await db('sale_products').where({ sale_product_id }).update(changes, '*')
    return updated_sale_product
}

const remove = async (sale_product_id) => {
    const [deleted_sale_product] = await db('sale_products').delete().where({ sale_product_id }).returning(['sale_product_id','sale_product_sale_id','sale_product_product_id'])
    return deleted_sale_product
}

module.exports = {
    find,
    findById,
    findBy,
    add, 
    update,
    remove
}
