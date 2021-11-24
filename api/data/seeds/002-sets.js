
exports.seed = function(knex) {
  return knex('sets').insert([
    {
      set_name: 'Celebrations'
    },
    {
      set_name: 'evolving skies'
    },
    {
      set_name: 'chilling reign'
    },
    {
      set_name: 'battle styles'
    },
    {
      set_name: 'shining fates'
    },
    {
      set_name: 'vivid voltage'
    },
    {
      set_name: 'champions path'
    },
    {
      set_name: 'darkness ablaze'
    },
    {
      set_name: 'rebel clash'
    },
    {
      set_name: 'sword and shield base set'
    },
    {
      set_name: 'hidden fates'
    },
    {
      set_name: 'SM Promos'
    }
  ]);
};
