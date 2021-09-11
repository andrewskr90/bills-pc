
exports.up = async function(knex) {
  await knex.schema
    .createTable('sellers', table => {
        table.increments('seller_id')
        table.string('seller_name')
            .notNullable()
        table.string('seller_website')
    })
    .createTable('seller_locations', table => {
        table.increments('seller_location_id')
        table.string('seller_location_name')
            .notNullable()
        table.string('seller_location_address')
        table.string('seller_location_telephone')
        table.integer('seller_id')
            .unsigned()
            .notNullable()
            .references('seller_id')
            .inTable('sellers')
            .onDelete('RESTRICTED')
            .onUpdate('RESTRICTED')
    })
    .createTable('transactions', table => {
        table.increments('transaction_id')
        table.date('transaction_date')
            .notNullable()
        table.integer('transaction_amount')
            .notNullable()
        table.timestamp('created_at')
        table.integer('seller_id')
            .unsigned()
            .notNullable()
            .references('seller_id')
            .inTable('sellers')
            .onDelete('RESTRICTED')
            .onUpdate('RESTRICTED')
        table.integer('seller_location_id')
            .unsigned()
            .notNullable()
            .references('seller_location_id')
            .inTable('seller_locations')
            .onDelete('RESTRICTED')
            .onUpdate('RESTRICTED')
    })
};

exports.down = function(knex) {
  
};
