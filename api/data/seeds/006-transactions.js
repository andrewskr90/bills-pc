exports.seed = function(knex) {
  return knex('transactions').insert([
    {
      transaction_date: '2020-12-27',
      transaction_type: 'purchase',
      transaction_amount: 220,
      user_id: 1
    },
    {
      transaction_date: '2020-12-27',
      transaction_type: 'purchase',
      transaction_amount: 120,
      user_id: 2
    },
    {
      transaction_date: '2020-12-28',
      transaction_type: 'trade',
      transaction_amount: 0,
      user_id: 1
    },
    {
      transaction_date: '2020-12-28',
      transaction_type: 'trade',
      transaction_amount: 0,
      user_id: 2
    }
  ]);
};