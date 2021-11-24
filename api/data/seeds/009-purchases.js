exports.seed = function(knex) {
  return knex('purchases').insert([
    {
      purchase_price: 220,
      transaction_id: 1,
      seller_id: 1,
      seller_location_id: 1,
      user_id: 1
    },
    {
      purchase_price: 120,
      transaction_id: 2,
      seller_id: 1,
      seller_location_id: 1,
      user_id: 2
    }
  ]);
};
