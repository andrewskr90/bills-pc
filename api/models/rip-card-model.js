const db = require('../data/dbconfig')

const find = () => {
    return db('rip_cards')
}

const findById = (rip_card_id) => {
    return db('rip_cards').where({ rip_card_id }).first()
}

function findBy(filter) {
    return db('rip_cards').where(filter).orderBy("rip_card_id");
  }

const add = async (rip_card) => {
    const [rip_card_id] = await db('rip_cards').insert(rip_card, 'rip_card_id')
    return findById(rip_card_id)
}

const update = async (rip_card_id, changes) => {
    const [updated_rip_card] = await db('rip_cards').where({ rip_card_id }).update(changes, '*')
    return updated_rip_card
}

const remove = async (rip_card_id) => {
    const [deleted_rip_card] = await db('rip_cards').delete().where({ rip_card_id }).returning(['rip_card_id','rip_card_rip_id','rip_card_card_id'])
    return deleted_rip_card
}

module.exports = {
    find,
    findById,
    findBy,
    add, 
    update,
    remove
}
