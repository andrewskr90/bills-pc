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
                card_v2_tcgplayer_card_id: card.productId
            }
            return newCard
        })
        console.log(formattedCards)
        return formattedCards
    }
}

module.exports = tcgPlayerFormatters
