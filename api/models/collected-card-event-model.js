const db = require('../data/dbconfig')

const find = () => {
    return db('collected_card_events')
}

const findById = (collected_card_event_id) => {
    return db('collected_card_events').where({ collected_card_event_id }).first()
}

function findBy(filter) {
    return db('collected_card_events').where(filter).orderBy("collected_card_event_id");
  }

const add = async (collected_card_event) => {
    const [collected_card_event_id] = await db('collected_card_events').insert(collected_card_event, 'collected_card_event_id')
    return findById(collected_card_event_id)
}

const update = async (collected_card_event_id, changes) => {
    const [updated_collected_card_event] = await db('collected_card_events').where({ collected_card_event_id }).update(changes, '*')
    return updated_collected_card_event
}

const remove = async (collected_card_event_id) => {
    const [deleted_collected_card_event] = await db('collected_card_events').delete().where({ collected_card_event_id }).returning(['collected_card_event_id','collected_card_event_card_id'])
    return deleted_collected_card_event
}

module.exports = {
    find,
    findById,
    findBy,
    add, 
    update,
    remove
}
