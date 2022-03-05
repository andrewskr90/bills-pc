const db = require('../data/dbconfig')

const find = () => {
    return db('collected_cards')
}

const findById = (collected_card_id) => {
    return db('collected_cards').where({ collected_card_id }).first()
}

function findBy(filter) {
    return db('collected_cards').where(filter).orderBy("collected_card_id");
  }

const add = async (collected_card) => {
    const [collected_card_id] = await db('collected_cards').insert(collected_card, 'collected_card_id')
    return findById(collected_card_id)
}

const update = async (collected_card_id, changes) => {
    const [updated_collected_card] = await db('collected_cards').where({ collected_card_id }).update(changes, '*')
    return updated_collected_card
}

const remove = async (collected_card_id) => {
    const [deleted_collected_card] = await db('collected_cards').delete().where({ collected_card_id }).returning(['collected_card_id','collected_card_card_id'])
    return deleted_collected_card
}

module.exports = {
    find,
    findById,
    findBy,
    add, 
    update,
    remove
}
