const tcgPlayerFormatters = {
    formatTcgDetailsSets(sets) {
        const formattedSets = sets.map(set => {
            const newSet = {
                set_v2_id: set.set_id,
                set_v2_name: set.setName,
                set_v2_tcgplayer_set_id: set.setId

            }
            return newSet
        })
        return formattedSets
    },
    formatTcgDetailsCards(cards) {
        const formattedCards = cards.map(card => {
            const newCard = {
                card_v2_id: card.card_id,
                card_v2_set_id: card.set_v2_id,
                card_v2_name: card.productName,
                card_v2_number: card.customAttributes.number,
                card_v2_rarity: card.rarityName,
                card_v2_tcgplayer_product_id: card.productId,
                card_v2_foil_only: card.foilOnly
            }
            return newCard
        })
        return formattedCards
    },
    formatTcgDetailsProducts(products) {
        const formattedProducts = products.map(product => {
            const newProduct = {
                product_id: product.product_id,
                product_set_id: product.set_v2_id,
                product_name: product.productName,
                product_release_date: product.customAttributes.releaseDate,
                product_description: product.customAttributes.description,
                product_tcgplayer_product_id: product.productId
            }
            return newProduct
        })
        return formattedProducts
    }
}

module.exports = tcgPlayerFormatters
