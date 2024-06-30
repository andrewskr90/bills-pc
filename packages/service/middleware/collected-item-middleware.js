const { parseGroupConcat } = require("../utils")

const formatParsedAppraisalArray = (appraisalArray) => {
    return appraisalArray.map(array => {
        return array.map((value, idx) => {
            if (idx === 0) return parseInt(value)
            return value
        })
    })
}

const parseThenFormatAppraisals = (unparsedAppraisal) => {
    return formatParsedAppraisalArray(parseGroupConcat(unparsedAppraisal))
}

module.exports = { parseThenFormatAppraisals }