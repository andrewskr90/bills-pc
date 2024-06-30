    const parseGroupConcat = (stringArray) => {
        if (!stringArray) return undefined
        const commaSplit = stringArray.split(',')
        const datesAndPrices = []
        let tempArray = []
        commaSplit.forEach(str => {
            const splitStr = str.split('')
            if (splitStr[0] === '[') {
                tempArray.push(str.slice(1))
            } else if (splitStr[splitStr.length-1] === ']') {
                tempArray.push(str.slice(0, splitStr.length-1))
                datesAndPrices.push(tempArray)
                tempArray = []
            } else {
                tempArray.push(str)
            }
        })
        return datesAndPrices
    }

    module.exports = { parseGroupConcat }