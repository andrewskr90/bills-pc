
export const countFilters = (filterConfig, filterType) => {
    let filterCount = 0
    //check if specific filter type is active
    if (filterType) {
        Object.keys(filterConfig[filterType]).forEach(filter => {
            if (filterConfig[filterType][filter]) filterCount += 1
        })
    // check if any filters are active
    } else {
        Object.keys(filterConfig).forEach(filterType => {
            Object.keys(filterConfig[filterType]).forEach(filter => {
                if (filterConfig[filterType][filter]) filterCount += 1
            })
        })
    }
    return filterCount
}

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

export const filterExpansions = (expansions, expansionFilterConfig) => {
    const filterCount = countFilters(expansionFilterConfig)

    return expansions.filter(expansion => {
        let includeExpansion = false
        if (filterCount > 0) {
            if (expansionFilterConfig.expansionSeries[expansion.set_v2_series]) {
                includeExpansion = true
            }
        } else {
            includeExpansion = true
        }
        return includeExpansion
    })
}

export const clearFilters = (filterConfig) => {
    Object.keys(filterConfig).forEach(filterType => {
        Object.keys(filterConfig[filterType]).forEach(filter => {
            filterConfig[filterType][filter] = false
        })
    })
    return filterConfig
}