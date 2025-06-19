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
            if (a.marketValue[a.printings[0]] === b.marketValue[b.printings[0]]) return 0
            if (a.marketValue[a.printings[0]] === null) return 1
            if (b.marketValue[b.printings[0]] === null) return -1
            if (referenceData[sortKey].direction === 'desc') { 
                return Math.abs(b.marketValue[b.printings[0]]) - Math.abs(a.marketValue[a.printings[0]])
            } else {
                return Math.abs(a.marketValue[a.printings[0]]) - Math.abs(b.marketValue[b.printings[0]])
            }
        } else if (referenceData[sortKey].value === 'percentChange') {
            if (a.formattedPrices[a.printings[0]].changes[referenceData.dateRange] === b.formattedPrices[b.printings[0]].changes[referenceData.dateRange]) return 0
            if (a.formattedPrices[a.printings[0]].changes[referenceData.dateRange] === null) return 1
            if (b.formattedPrices[b.printings[0]].changes[referenceData.dateRange] === null) return -1
            if (referenceData[sortKey].direction === 'desc') {
                return Math.abs(b.formattedPrices[b.printings[0]].changes[referenceData.dateRange]) - Math.abs(a.formattedPrices[a.printings[0]].changes[referenceData.dateRange])
            } else {
                return Math.abs(a.formattedPrices[a.printings[0]].changes[referenceData.dateRange]) - Math.abs(b.formattedPrices[b.printings[0]].changes[referenceData.dateRange])
            }
        }
    }
    return marketItemSortCB
}
