
export const filterMarketItems = (marketItems, marketFilterConfig) => {
    let filterCount = countFilters(marketFilterConfig)
    let rarityFilterCount = countFilters(marketFilterConfig, 'cardRarity')
    
    return marketItems.filter(item => {
        let includeItem = false
        if (filterCount > 0) {
            if (item.product_id) {
                if (marketFilterConfig.itemType.product) {
                    includeItem = true
                }
            } else {
                if (rarityFilterCount > 0) {
                    if (marketFilterConfig.cardRarity[item.rarity]) {
                        includeItem = true
                    }
                } else if (marketFilterConfig.itemType.card) {
                    if (item.card_id) {
                        includeItem = true
                    }
                }
            }
        } else {
            includeItem = true
        }
        return includeItem
    })
}
