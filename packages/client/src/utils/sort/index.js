export const generateMarketItemSortCB = (referenceData, sortKey) => {
    const marketItemSortCB = (a, b) => {
        if (referenceData[sortKey].value === 'name') {
            if (a.name === b.name) return 0
            if (a.name === null) return 1
            if (b.name === null) return -1
            if (referenceData[sortKey].direction === 'asc') { 
                if (a.name.toLowerCase() > b.name.toLowerCase()) return 1
                else return -1
            } else {
                if (a.name.toLowerCase() < b.name.toLowerCase()) return 1
                else return -1
            }
        } else if (referenceData[sortKey].value === 'marketValue') {
            if (a.marketValue === b.marketValue) return 0
            if (a.marketValue === null) return 1
            if (b.marketValue === null) return -1
            if (referenceData[sortKey].direction === 'desc') { 
                return Math.abs(b.marketValue) - Math.abs(a.marketValue)
            } else {
                return Math.abs(a.marketValue) - Math.abs(b.marketValue)
            }
        } else if (referenceData[sortKey].value === 'percentChange') {
            if (a.formattedPrices.changes[referenceData.dateRange] === b.formattedPrices.changes[referenceData.dateRange]) return 0
            if (a.formattedPrices.changes[referenceData.dateRange] === null) return 1
            if (b.formattedPrices.changes[referenceData.dateRange] === null) return -1
            if (referenceData[sortKey].direction === 'desc') {
                return Math.abs(b.formattedPrices.changes[referenceData.dateRange]) - Math.abs(a.formattedPrices.changes[referenceData.dateRange])
            } else {
                return Math.abs(a.formattedPrices.changes[referenceData.dateRange]) - Math.abs(b.formattedPrices.changes[referenceData.dateRange])
            }
        }
    }
    return marketItemSortCB
}
