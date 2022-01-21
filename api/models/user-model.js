const db = require('../data/dbconfig')

const findById = (user_id) => {
    return db('users').where({ user_id }).first()
}

const add = async (user) => {
    const [user_id] = await db('users').insert(user, 'user_id')
    return findById(user_id)
}

module.exports = {
    findById,
    add
}