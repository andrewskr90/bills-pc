export const generateKeyMarketDates = () => {
    const today = new Date()
    //sets today's date to UTC midnight
    today.setUTCHours(0,0,0,0)
    const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate()-1, today.getHours())  
    const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate()-6, today.getHours())
    const twoWeeks = new Date(today.getFullYear(), today.getMonth(), today.getDate()-13, today.getHours())
    const lastMonth = new Date(today.getFullYear(), today.getMonth()-1, today.getDate(), today.getHours())
    const lastYear = new Date(today.getFullYear()-1, today.getMonth(), today.getDate(), today.getHours())
    return {
        today,
        yesterday,
        lastWeek,
        twoWeeks,
        lastMonth,
        lastYear
    }
}

export const localYYYYMMDD = () => {
    const today = new Date()
    const yyyy = today.getFullYear()
    let mm = today.getMonth() + 1
    let dd = today.getDate()
    if (mm < 10) mm = `0${mm}`
    if (dd < 10) dd = `0${dd}`
    return `${yyyy}-${mm}-${dd}`
}

export const formatDate = (dateCode) => {
    const dateParts = dateCode.split('-')
    return `${dateParts[1]}-${dateParts[2].split('T')[0]}-${dateParts[0]}`
}

export const convertLocalToUTC = (local) => {
    const utcDate = new Date(local)
    return utcDate.toISOString()
}