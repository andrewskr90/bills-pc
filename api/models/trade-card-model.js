const db = require('../data/dbconfig')

const find = () => {
    return db('trade_cards')
}

const findById = (trade_card_id) => {
    return db('trade_cards').where({ trade_card_id }).first()
}

function findBy(filter) {
    return db('trade_cards').where(filter).orderBy("trade_card_id");
  }

const add = async (trade_card) => {
    const [trade_card_id] = await db('trade_cards').insert(trade_card, 'trade_card_id')
    return findById(trade_card_id)
}

const update = async (trade_card_id, changes) => {
    const [updated_trade_card] = await db('trade_cards').where({ trade_card_id }).update(changes, '*')
    return updated_trade_card
}

const remove = async (trade_card_id) => {
    const [deleted_trade_card] = await db('trade_cards').delete().where({ trade_card_id }).returning(['trade_card_id','trade_card_trade_id','trade_card_card_id', 'trade_card_trader_color'])
    return deleted_trade_card
}

module.exports = {
    find,
    findById,
    findBy,
    add, 
    update,
    remove
}
