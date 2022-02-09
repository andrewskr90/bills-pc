const sanitizeObjectValues = (req, res, next) => {
    const objectToSanitize = req.body
    const objectKeysArray = Object.keys(objectToSanitize)
    objectKeysArray.map(key => {
        if (typeof objectToSanitize[key] === 'string') {
            //remove extra spaces
            let trimmedString = objectToSanitize[key].trim()
            let charArray = trimmedString.split('')
            let singleSpacesString = ''
            for (let i=0; i< charArray.length; i++) {
                if (charArray[i] === ' ') {
                    if (charArray[i+1] === ' ') {
                        continue
                    }
                }
                singleSpacesString += charArray[i]
            }
            //capitalize each word
            const stringSplit = singleSpacesString.split(' ')
            const stringSplitCapitalized = stringSplit.map(word => {
                let capitalizedWord = ''
                for (let i = 0; i < word.length; i++) {
                    if (i === 0) {
                    capitalizedWord += word[i].toUpperCase();
                    } else {
                    capitalizedWord += word[i].toLowerCase();
                    }
                }
                return capitalizedWord
            })
            const sanitizedString = stringSplitCapitalized.join(' ')
            objectToSanitize[key] = sanitizedString
        } else if (typeof objectToSanitize[key] === 'number') {
            console.log('number')
        } else if (typeof objectToSanitize[key] === 'boolean') {
            console.log('boolean')
        } else if (typeof objectToSanitize[key] === 'undefined') {
            console.log('undefined')
        }
    })
    req.body = objectToSanitize
    next()
}

module.exports = {
    sanitizeObjectValues
}