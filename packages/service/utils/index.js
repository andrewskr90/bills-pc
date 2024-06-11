    const parseGroupConcat = (stringArray) => {
        if (!stringArray) return undefined
        const commaSplit = stringArray.split(',')
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
        return datesAndPrices
    }

    module.exports = { parseGroupConcat }