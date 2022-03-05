const db = require('../data/dbconfig')

const find = () => {
    return db('sales')
}

const findById = (sale_id) => {
    return db('sales').where({ sale_id }).first()
}

function findBy(filter) {
    return db('sales').where(filter).orderBy("sale_id");
  }

const add = async (sale) => {
    const [sale_id] = await db('sales').insert(sale, 'sale_id')
    return findById(sale_id)
}

const update = async (sale_id, changes) => {
    const [updated_sale] = await db('sales').where({ sale_id }).update(changes, '*')
    return updated_sale
}

const remove = async (sale_id) => {
    const [deleted_sale] = await db('sales').delete().where({ sale_id }).returning(['sale_id','sale_name'])
    return deleted_sale
}

module.exports = {
    find,
    findById,
    findBy,
    add, 
    update,
    remove
}
