exports.seed = function(knex) {
  return knex('seller_locations').insert([
    {
      seller_location_name: 'Puyallup',
      seller_id: 1,
      user_id: 1
    }
  ]);
};