exports.seed = function(knex) {
  return knex('collected_products').insert([
    {
      purchase_item_id: 1,
      traded_for_item_id: null,
      product_id: 1,
      user_id: 1
    },
    {
      purchase_item_id: 2,
      traded_for_item_id: null,
      product_id: 3,
      user_id: 1
    },
    {
      purchase_item_id: 3,
      traded_for_item_id: null,
      product_id: 3,
      user_id: 2
    },
    {
      purchase_item_id: null,
      traded_for_item_id: 1,
      product_id: 3,
      user_id: 1
    },
    {
      purchase_item_id: null,
      traded_for_item_id: 2,
      product_id: 1,
      user_id: 2
    }
  ]);

};
