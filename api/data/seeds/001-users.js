exports.seed = function(knex) {
  return knex('users').insert([
    {
      username: 'ronhaar',
      password: '1234',
      email: 'andrewskr90@gmail.com',
      favoriteGen: '1'
    },
    {
      username: 'frokusblakah',
      password: '1234',
      email: 'rsandre@uw.edu',
      favoriteGen: '1'
    }
  ]);
};
