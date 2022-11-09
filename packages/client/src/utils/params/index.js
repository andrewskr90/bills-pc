export const parseParams = (params) => {
    const splitQuestionMark = params.split('?')
    const variablesAndProperties = splitQuestionMark[1].split('&')
    const keysAndValues = {}
    variablesAndProperties.forEach(pair => {
        const keyAndValue = pair.split('=')
        keysAndValues[keyAndValue[0]] = decodeURI(keyAndValue[1])
    })
    return keysAndValues
}

export const eligableMarketSearchParams = (location) => {
    // verify search eligability
    // returns eligable params object, or false
    if (!location.search) return false
    const parsedParams = parseParams(location.search)
    if (!parsedParams.value) return false
    if (parsedParams.category !== 'cards' && parsedParams.category !== 'products') {
        parsedParams.category = 'all'
    }
    return parsedParams
}