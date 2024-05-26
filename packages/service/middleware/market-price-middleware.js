const formatMarketPricesFromConcat = (req, res, next) => {
    const itemPriceLookup = {}
    const itemLookup = {}
    const formattedMarketPricesFromConcat = req.results.filter((itemPrinting, i) => {
        if (itemPrinting.prices) {
            const commaSplit = itemPrinting.prices.split(',')
            const datesAndPrices = []
            let tempArray = []
            commaSplit.forEach(str => {
                const splitStr = str.split('')
                if (splitStr[0] === '[') {
                    tempArray.push(parseInt(splitStr.filter(letter => letter !== '[').join('')))
                } else {
                    tempArray.push(parseFloat(splitStr.filter(letter => letter !== ']').join('')))
                    datesAndPrices.push(tempArray)
                    tempArray = []
                }
            })
            if (itemPriceLookup[itemPrinting.id]) {
                itemPriceLookup[itemPrinting.id] = {
                    ...itemPriceLookup[itemPrinting.id],
                    [itemPrinting.printing_name]: datesAndPrices
                }
            } else {
                itemPriceLookup[itemPrinting.id] = {
                    [itemPrinting.printing_name]: datesAndPrices
                }
            }
            
        }
        if (itemLookup[itemPrinting.id]) return false
        itemLookup[itemPrinting.id] = 1
        return true
    }).map(item => {
        return {
                ...item,
                prices: itemPriceLookup[item.id],
                printings: Object.keys(itemPriceLookup[item.id])
            }
    })
    req.results = formattedMarketPricesFromConcat
    next()
}

const formatTopTenAverageResults = (req, res, next) => {
    req.results = req.results.map(set => {
        let todayAverage = null
        if (set.top_ten_average_today !== null) {
            // averages from sql query returning string for some reason
            todayAverage = Number(set.top_ten_average_today)             
        }
        return {
            id: set.set_v2_id,
            name: set.set_v2_name,
            ptcgio_id: set.set_v2_ptcgio_id,
            series: set.set_v2_series,
            release_date: set.set_v2_release_date,
            topTenAverage: {
                today: todayAverage,
            },
            items: [],
        }
    })
    next()
}


module.exports = { formatMarketPricesFromConcat, formatTopTenAverageResults }
