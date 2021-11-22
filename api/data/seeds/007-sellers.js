exports.seed = function(knex) {
  return knex('sellers').insert([
    {
      seller_name: 'Baseball Card Shop',
      seller_website: null,
      user_id: 1
    }
  ]);
};