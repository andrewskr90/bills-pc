const formatSingleSetMarketResults = (req, res, next) => {
    if (req.params.set_v2_id) {
        const formattedResults = req.results.map((item, i) => {
            if (item.market_price_prices) {
                const commaSplit = item.market_price_prices.split(',')
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
                return {
                    ...item,
                    market_price_prices: datesAndPrices
                }
            } else {
                return item
            }
        })
        req.results = formattedResults
    }
    next()
}

const formatTopTenAverageResults = (req, res, next) => {
    req.results = req.results.map(set => {
        let todayAverage = null
        let weekAverage = null
        let weekChange = null
        let twoWeekAverage = null
        let twoWeekChange = null
        let monthAverage = null
        let monthChange = null
        if (set.top_ten_average_today !== null) {
            // averages from sql query returning string for some reason
            todayAverage = Number(set.top_ten_average_today)
            if (set.top_ten_average_week !== null) {
                weekAverage = Number(set.top_ten_average_week)
                weekChange = (todayAverage - weekAverage) / weekAverage * 100
            }
            if (set.top_ten_average_two_week !== null) {
                twoWeekAverage = Number(set.top_ten_average_two_week)
                twoWeekChange = (todayAverage - twoWeekAverage) / twoWeekAverage * 100
            }
            if (set.top_ten_average_month !== null) {
                monthAverage = Number(set.top_ten_average_month)
                monthChange = (todayAverage - monthAverage) / monthAverage * 100
            }                
        }
        return {
            id: set.set_v2_id,
            name: set.set_v2_name,
            ptcgio_id: set.set_v2_ptcgio_id,
            series: set.set_v2_series,
            release_date: set.set_v2_release_date,
            topTenAverage: {
                today: todayAverage,
                week: weekAverage,
                twoWeek: twoWeekAverage,
                month: monthAverage
            },
            topTenPercentChange: {
                week: weekChange,
                twoWeek: twoWeekChange,
                month: monthChange
            },
            items: [],
        }
    })
    next()
}


module.exports = { formatSingleSetMarketResults, formatTopTenAverageResults }
