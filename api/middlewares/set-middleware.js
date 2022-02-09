function verifySet(req, res, next) {
    if (!req.body.set_name) {
        next({
            status: 400,
            message: 'Must include set name'
        })
    }
    next()
}

function removeExtraSpaces(req, res, next) {
    //remove extra spaces
    let trimmedString = req.body.set_name.trim()
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
    const setNameSplit = singleSpacesString.split(' ')
    const setNameSplitCapitalized = setNameSplit.map(word => {
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
    const singleSpacedSet = setNameSplitCapitalized.join(' ')
    req.body.set_name = singleSpacedSet
    next()
}

module.exports = {
    verifySet,
    removeExtraSpaces
}
