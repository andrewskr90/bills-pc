exports.seed = function(knex) {
  return knex('traded_for_items').insert([
    {
      trade_id: 1,
      product_id: 3,
      user_id: 1
    },
    {
      trade_id: 2,
      product_id: 1,
      user_id: 2
    }
  ]);
};
