const db = require('../data/dbconfig')

const find = () => {
    return db('trade_products')
}

const findById = (trade_product_id) => {
    return db('trade_products').where({ trade_product_id }).first()
}

function findBy(filter) {
    return db('trade_products').where(filter).orderBy("trade_product_id");
  }

const add = async (trade_product) => {
    const [trade_product_id] = await db('trade_products').insert(trade_product, 'trade_product_id')
    return findById(trade_product_id)
}

const update = async (trade_product_id, changes) => {
    const [updated_trade_product] = await db('trade_products').where({ trade_product_id }).update(changes, '*')
    return updated_trade_product
}

const remove = async (trade_product_id) => {
    const [deleted_trade_product] = await db('trade_products').delete().where({ trade_product_id }).returning(['trade_product_id','trade_product_trade_id','trade_product_product_id', 'trade_product_trader_color'])
    return deleted_trade_product
}

module.exports = {
    find,
    findById,
    findBy,
    add, 
    update,
    remove
}
