const db = require('../data/dbconfig')

const find = () => {
    return db('rip_sessions')
}

const findById = (rip_session_id) => {
    return db('rip_sessions').where({ rip_session_id }).first()
}

function findBy(filter) {
    return db('rip_sessions').where(filter).orderBy("rip_session_id");
  }

const add = async (rip_session) => {
    const [rip_session_id] = await db('rip_sessions').insert(rip_session, 'rip_session_id')
    return findById(rip_session_id)
}

const update = async (rip_session_id, changes) => {
    const [updated_rip_session] = await db('rip_sessions').where({ rip_session_id }).update(changes, '*')
    return updated_rip_session
}

const remove = async (rip_session_id) => {
    const [deleted_rip_session] = await db('rip_sessions').delete().where({ rip_session_id }).returning(['rip_session_id','rip_session_date'])
    return deleted_rip_session
}

module.exports = {
    find,
    findById,
    findBy,
    add, 
    update,
    remove
}
