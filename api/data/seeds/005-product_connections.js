exports.seed = function(knex) {
  return knex('product_connections').insert([
    {
      parent_product_connection_id: 1,
      child_product_connection_id: 2,
      child_product_connection_quantity: 10,
      child_card_connection_id: null
    },
    {
      parent_product_connection_id: 1,
      child_product_connection_id: null,
      child_product_connection_quantity: null,
      child_card_connection_id: 2
    }
  ]);
};