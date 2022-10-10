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


module.exports = { formatSingleSetMarketResults }
