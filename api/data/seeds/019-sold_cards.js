exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('sold_cards')
    .then(function () {
      // Inserts seed entries
      return knex('sold_cards').insert([
        {
          sale_id: 1,
          collected_card_id: 1,
          user_id: 1
        }
      ]);
    });
};