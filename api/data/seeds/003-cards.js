
exports.seed = function(knex) {
  return knex('cards').insert([
    {
      card_name: 'Dragonite V',
      card_set_number: 192,
      card_rarity: 'Alternate Art',
      card_image_url: 'https://product-images.tcgplayer.com/fit-in/400x558/246758.jpg',
      set_id: 2
    },
    {
      card_name: 'Moltres & Zapdos & Articuno GX',
      card_set_number: 210,
      card_rarity: 'Promo',
      card_image_url: 'https://product-images.tcgplayer.com/fit-in/400x558/189659.jpg',
      set_id: 12
    }
  ]);
};
