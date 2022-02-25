const db = require('../data/dbconfig')

const find = () => {
    return db('trades')
}

const findById = (trade_id) => {
    return db('trades').where({ trade_id }).first()
}

function findBy(filter) {
    return db('trades').where(filter).orderBy("trade_id");
  }

const add = async (trade) => {
    const [trade_id] = await db('trades').insert(trade, 'trade_id')
    return findById(trade_id)
}

const update = async (trade_id, changes) => {
    const [updated_trade] = await db('trades').where({ trade_id }).update(changes, '*')
    return updated_trade
}

const remove = async (trade_id) => {
    const [deleted_trade] = await db('trades').delete().where({ trade_id }).returning(['trade_id','trade_name'])
    return deleted_trade
}

module.exports = {
    find,
    findById,
    findBy,
    add, 
    update,
    remove
}
