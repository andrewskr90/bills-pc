const db = require('../data/dbconfig')

const find = () => {
    return db('users')
}

const findById = (user_id) => {
    return db('users').where({ user_id }).first()
}

function findBy(filter) {
    return db('users').where(filter).orderBy("user_id");
  }

const add = async (user) => {
    const [user_id] = await db('users').insert(user, 'user_id')
    return findById(user_id)
}

const update = async (user_id, changes) => {
    const [updated_user] = await db('users').where({ user_id }).update(changes, '*')
    return updated_user
}

const remove = async (user_id) => {
    const [deleted_user] = await db('users').delete().where({ user_id }).returning(['user_id','user_name'])
    return deleted_user
}

module.exports = {
    find,
    findById,
    findBy,
    add, 
    update,
    remove
}
