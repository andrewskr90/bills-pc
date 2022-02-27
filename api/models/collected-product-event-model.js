const db = require('../data/dbconfig')

const find = () => {
    return db('collected_product_events')
}

const findById = (collected_product_event_id) => {
    return db('collected_product_events').where({ collected_product_event_id }).first()
}

function findBy(filter) {
    return db('collected_product_events').where(filter).orderBy("collected_product_event_id");
  }

const add = async (collected_product_event) => {
    const [collected_product_event_id] = await db('collected_product_events').insert(collected_product_event, 'collected_product_event_id')
    return findById(collected_product_event_id)
}

const update = async (collected_product_event_id, changes) => {
    const [updated_collected_product_event] = await db('collected_product_events').where({ collected_product_event_id }).update(changes, '*')
    return updated_collected_product_event
}

const remove = async (collected_product_event_id) => {
    const [deleted_collected_product_event] = await db('collected_product_events').delete().where({ collected_product_event_id }).returning(['collected_product_event_id','collected_product_id'])
    return deleted_collected_product_event
}

module.exports = {
    find,
    findById,
    findBy,
    add, 
    update,
    remove
}
