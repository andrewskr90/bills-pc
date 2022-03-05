const db = require('../data/dbconfig')

const find = () => {
    return db('vendor_locations')
}

const findById = (vendor_location_id) => {
    return db('vendor_locations').where({ vendor_location_id }).first()
}

function findBy(filter) {
    return db('vendor_locations').where(filter).orderBy("vendor_location_id");
  }

const add = async (vendor_location) => {
    const [vendor_location_id] = await db('vendor_locations').insert(vendor_location, 'vendor_location_id')
    return findById(vendor_location_id)
}

const update = async (vendor_location_id, changes) => {
    const [updated_vendor_location] = await db('vendor_locations').where({ vendor_location_id }).update(changes, '*')
    return updated_vendor_location
}

const remove = async (vendor_location_id) => {
    const [deleted_vendor_location] = await db('vendor_locations').delete().where({ vendor_location_id }).returning(['vendor_location_id','vendor_location_name'])
    return deleted_vendor_location
}

module.exports = {
    find,
    findById,
    findBy,
    add, 
    update,
    remove
}
