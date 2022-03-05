const db = require('../data/dbconfig')

const find = () => {
    return db('cards')
}

const findById = (card_id) => {
    return db('cards').where({ card_id }).first()
}

function findBy(filter) {
    return db('cards').where(filter).orderBy("card_id");
  }

const add = async (card) => {
    const [card_id] = await db('cards').insert(card, 'card_id')
    return findById(card_id)
}

const update = async (card_id, changes) => {
    const [updated_card] = await db('cards').where({ card_id }).update(changes, '*')
    return updated_card
}

const remove = async (card_id) => {
    const [deleted_card] = await db('cards').delete().where({ card_id }).returning(['card_id','card_name'])
    return deleted_card
}

module.exports = {
    find,
    findById,
    findBy,
    add, 
    update,
    remove
}
