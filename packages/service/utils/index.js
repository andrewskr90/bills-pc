    const parseGroupConcat = (stringArray) => {
        return JSON.parse('[' + stringArray + ']')
    }

    module.exports = { parseGroupConcat }