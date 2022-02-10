exports.seed = function(knex) {
  return knex('trades').insert([
    {
      transaction_id: 3,
      trade_partner_user_name: "frokusblakah",
      trade_partner_user_id: 2,
      user_id: 1
    },
    {
      transaction_id: 4,
      trade_partner_user_name: "ronhaar",
      trade_partner_user_id: 1,
      user_id: 2
    }
  ]);
};