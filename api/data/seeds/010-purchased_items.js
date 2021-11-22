exports.seed = function(knex) {
  return knex('purchased_items').insert([
    {
      purchased_item_price: 100,
      product_id: 1,
      purchase_id: 1,
      user_id: 1
    },
    {
      purchased_item_price: 120,
      product_id: 3,
      purchase_id: 1,
      user_id: 1
    },
    {
      purchased_item_price: 120,
      product_id: 3,
      purchase_id: 2,
      user_id: 2
    },
  ]);
};
