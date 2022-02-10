exports.seed = function(knex) {
  return knex('users').insert([
    {
      user_name: 'ronhaar',
      user_password: '1234',
      user_email: 'andrewskr90@gmail.com',
      user_favorite_gen: '1'
    },
    {
      user_name: 'frokusblakah',
      user_password: '1234',
      user_email: 'rsandre@uw.edu',
      user_favorite_gen: '1'
    }
  ]);
};
