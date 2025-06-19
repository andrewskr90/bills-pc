const { parseGroupConcat } = require("../utils")

const formatParsedAppraisalArray = (appraisalArray) => {
    return appraisalArray.map(array => {
        return array.map((value, idx) => {
            if (idx === 0) return parseInt(value)
            return value
        })
    })
}

const formatParsedLabelArray = (labelArray) => {
    return labelArray.map(array => {
        const label = {}
        array.forEach((component, idx) => {
            let conditionedComponent = null
            if (component !== "NULL") conditionedComponent = component
            if (idx === 0) label.id = conditionedComponent
            if (idx === 1) label.labelComponentId = conditionedComponent
            if (idx === 2) label.rarityId = conditionedComponent
            if (idx === 3) label.typeId = conditionedComponent
            if (idx === 4) label.printingId = conditionedComponent
            if (idx === 5) label.setId === conditionedComponent
        })
        return label
    })
}

const parseThenFormatAppraisals = (unparsedAppraisal) => {
    return formatParsedAppraisalArray(parseGroupConcat(unparsedAppraisal))
}

const parseThenFormatLabels = (unparsedLabel) => {
    return formatParsedLabelArray(parseGroupConcat(unparsedLabel))
}
module.exports = { parseThenFormatAppraisals, parseThenFormatLabels }