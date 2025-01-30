const stringifyDateYYYYMMDD = (date) => date.toISOString().split('T')[0]

const adjustISOHours = (stringDate, adjustment) => {
    const oldDate = new Date(stringDate)
    oldDate.setHours(oldDate.getHours() + adjustment)
    return oldDate.toISOString()
}

const adjustISOMinutes = (stringDate, adjustment) => {
    const oldDate = new Date(stringDate)
    oldDate.setMinutes(oldDate.getMinutes() + adjustment)
    return oldDate.toISOString()
}

module.exports = { stringifyDateYYYYMMDD, adjustISOHours, adjustISOMinutes }
