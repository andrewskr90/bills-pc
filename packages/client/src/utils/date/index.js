export const generateKeyMarketDates = () => {
    const today = new Date()
    //sets today's date to UTC midnight
    today.setUTCHours(0,0,0,0)
    const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate()-1)
    const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate()-6)
    const lastMonth = new Date(today.getFullYear(), today.getMonth()-1, today.getDate())
    const lastYear = new Date(today.getFullYear()-1, today.getMonth(), today.getDate())
    return {
        today,
        yesterday,
        lastWeek,
        lastMonth,
        lastYear
    }
}