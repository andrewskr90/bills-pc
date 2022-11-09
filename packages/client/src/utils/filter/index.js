export const filterMarketItems = (marketItems, referenceData) => {
    const filterLib = {}
    referenceData.expansionItemFilters.forEach(filter => {
        filterLib[Object.keys(filter)[0]] = true
    })
    let rarityFilterActive
    referenceData.rarities.forEach(rarity => {
        if (filterLib[rarity]) {
            rarityFilterActive = true
        }
    })
    
    return marketItems.filter(item => {
        let includeItem = false
        if (item.market_prices !== null) {
            if (referenceData.expansionItemFilters.length > 0) {
                if (item.product_id) {
                    if (filterLib['Product']) {
                        includeItem = true
                    }
                } else {
                    if (rarityFilterActive) {
                        if (filterLib[item.rarity]) {
                            includeItem = true
                        }
                    } else if (filterLib['Card']) {
                        if (item.card_id) {
                            includeItem = true
                        }
                    }
                }
            } else {
                includeItem = true
            }
        }
        return includeItem
    })
}
