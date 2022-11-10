import { stringToCamelCase } from "../string"

export const filterMarketItems = (marketItems, referenceData) => {
    let filterActive = false
    let rarityFilterActive = false
    const marketFilters = referenceData.filter.market
    const filterTypes = Object.keys(marketFilters)
    filterTypes.forEach(type => {
        Object.keys(marketFilters[type]).forEach(filter => {
            if (marketFilters[type][filter]) {
                if (type === 'cardRarity') rarityFilterActive = true
                filterActive = true
            }
        })
    })
    
    return marketItems.filter(item => {
        let includeItem = false
        if (item.market_prices !== null) {
            if (filterActive) {
                if (item.product_id) {
                    if (marketFilters.itemType.product) {
                        includeItem = true
                    }
                } else {
                    if (rarityFilterActive) {
                        if (marketFilters.cardRarity[stringToCamelCase(item.rarity)]) {
                            includeItem = true
                        }
                    } else if (marketFilters.itemType.card) {
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

export const countFilters = (referenceData, filterKey) => {
    let filterCount = 0
    const filterConfig = referenceData.filter[filterKey]
    const filterTypes = Object.keys(filterConfig)
    filterTypes.forEach(type => {
        const filters = Object.keys(filterConfig[type])
        filters.forEach(filter => {
            if (filterConfig[type][filter]) filterCount += 1
        })
    })
    return filterCount
}