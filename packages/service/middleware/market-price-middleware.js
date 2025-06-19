const { parseGroupConcat } = require("../utils")

const formatMarketPricesFromConcat = (req, res, next) => {
    const itemPrintingLookup = {}
    const itemPriceLookup = {}
    const itemLookup = {}
    req.printingsAlreadyFormatted = true
    const formattedMarketPricesFromConcat = req.results.filter((itemPrinting, i) => {
        const splitPrices = itemPrinting.prices.split('],[')
        const shavedOffPartialPriceArray = splitPrices.filter((pair, idx) => idx !== splitPrices.length - 1)
        const datesAndPrices = itemPrinting.prices ? parseGroupConcat(shavedOffPartialPriceArray.join('],[') + ']') : []
        if (itemPriceLookup[itemPrinting.id]) {
            itemPriceLookup[itemPrinting.id] = {
                ...itemPriceLookup[itemPrinting.id],
                [itemPrinting.printing_id]: datesAndPrices
            }
        } else {
            itemPriceLookup[itemPrinting.id] = {
                [itemPrinting.printing_id]: datesAndPrices
            }
        }
        itemPrintingLookup[itemPrinting.id] = {
            ...itemPrintingLookup[itemPrinting.id],
            [itemPrinting.printing_id]: itemPrinting.printing_name
        }
        if (itemLookup[itemPrinting.id]) return false
        itemLookup[itemPrinting.id] = 1
        return true
    }).map(item => {
        return {
                ...item,
                prices: itemPriceLookup[item.id],
                printings: Object.keys(itemPrintingLookup[item.id]).map(printingId => ({
                    id: printingId,
                    name: itemPrintingLookup[item.id][printingId]
                })),
                sealed: item.condition_id === '7e464ec6-0b23-11ef-b8b9-0efd996651a9',

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
