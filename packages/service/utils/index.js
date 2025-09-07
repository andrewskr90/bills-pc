    const parseGroupConcat = (stringArray) => {
        return JSON.parse('[' + stringArray + ']')
    }

    const conditionStringForDb = (str) => {
        //remove accents
        let accentsRemoved = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        //escape apostrophes
        let escapedApostrophe = accentsRemoved.replace(/'/g, "''")
        return `'${escapedApostrophe}'`
    }

    const conditionValueForDb = (value) => {
        let conditionedValue
        if (value === null || value === undefined) conditionedValue = null
        else if (typeof value ==='string') {
            conditionedValue = conditionStringForDb(value)
        } else if (typeof value === 'boolean') {
            if (value) {
                conditionedValue = 1
            } else {
                conditionedValue = 0
            }
        } else {
            conditionedValue = value
        }
        return conditionedValue
    }

    module.exports = { parseGroupConcat, conditionStringForDb, conditionValueForDb }
