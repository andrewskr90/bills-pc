export const capitalizeWords = (string) => {
    const wordsSeperated = string.split(' ')
    return wordsSeperated.map(word => {
        const lettersSeperated = word.split('').map((letter, idx) => {
            if (idx === 0) return letter.toUpperCase()
            else return letter.toLowerCase()
        })
        return lettersSeperated.join('')
    }).join(' ')
}

export const stringToCamelCase = (string) => {
    const lowerCaseString = string.toLowerCase()
    const camelCase = lowerCaseString.split(' ').map((string, idx) => {
        return string.split('').map((letter, jdx) => {
            if (idx === 0) return letter
            if (jdx === 0) return letter.toUpperCase()
            return letter
        }).join('')
    }).join('')
    return camelCase
}

export const camelCaseToCapitalized = (camelCase) => {
    let capitalized = ''
    camelCase.split('').forEach((letter, idx) => {
        if (idx === 0) capitalized += letter.toUpperCase()
        else if (letter === letter.toUpperCase()) capitalized += ` ${letter}`
        else capitalized += letter
    })
    return capitalized
}

export const camelCaseToLowerCase = (camelCase) => {
    let lowerCase = ''
    camelCase.split('').forEach((letter, idx) => {
        if (letter === letter.toUpperCase()) lowerCase += ` ${letter.toLowerCase()}`
        else lowerCase += letter
    })
    return lowerCase
}