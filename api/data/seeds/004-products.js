exports.seed = function(knex) {
  return knex('products').insert([
    {
      product_name: 'Hidden Fates Elite Trainer Box',
      product_type: 'Elite Trainer Box',
      product_retail_price: 49.99,
      product_release_date: '2019-10-02',
      product_description: 'hidden fates etb, including shiny charizard gx',
      set_id: 11
    },
    {
      product_name: 'Hidden Fates Booster Pack',
      product_type: 'Booster Pack',
      product_retail_price: null,
      product_release_date: '2019-10-02',
      product_description: 'hidden fates booster pack, including shiny charizard gx',
      set_id: 11
    },
    {
      product_name: 'Darkness Ablaze Booster Box',
      product_type: 'Booster Box',
      product_retail_price: 140,
      product_release_date: '2020-10-02',
      product_description: 'darkness ablaze booster box, including charizard vmax',
      set_id: 8
    }
  ]);
};