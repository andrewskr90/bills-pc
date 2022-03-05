const db = require('../data/dbconfig')

const find = () => {
    return db('sale_cards')
}

const findById = (sale_card_id) => {
    return db('sale_cards').where({ sale_card_id }).first()
}

function findBy(filter) {
    return db('sale_cards').where(filter).orderBy("sale_card_id");
  }

const add = async (sale_card) => {
    const [sale_card_id] = await db('sale_cards').insert(sale_card, 'sale_card_id')
    return findById(sale_card_id)
}

const update = async (sale_card_id, changes) => {
    const [updated_sale_card] = await db('sale_cards').where({ sale_card_id }).update(changes, '*')
    return updated_sale_card
}

const remove = async (sale_card_id) => {
    const [deleted_sale_card] = await db('sale_cards').delete().where({ sale_card_id }).returning(['sale_card_id','sale_card_sale_id','sale_card_card_id'])
    return deleted_sale_card
}

module.exports = {
    find,
    findById,
    findBy,
    add, 
    update,
    remove
}
