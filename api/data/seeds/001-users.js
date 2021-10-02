exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users')
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          username: 'ronhaar',
          password: '1234',
          email: 'andrewskr90@gmail.com',
          favoriteGen: '1'
        }
      ]);
    });
};
