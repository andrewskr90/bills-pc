import { generateKeyMarketDates } from '../date'

export const calcItemMarketData = (prices) => {

    const keyMarketDates = generateKeyMarketDates()
    const { today, yesterday, lastWeek, twoWeeks, lastMonth, lastYear } = keyMarketDates

    const latestPrice = []
    const todayPrice = []
    const yesterdayPrice = []
    const weekPrices = []
    const twoWeekPrices = []
    const monthPrices = []
    const yearPrices = []
    prices.forEach((price, idx) => {
        if (price[0]*1000 > today.getTime()) {
            todayPrice.push(price)
        }
        if (idx === 0) latestPrice.push(price[1])
        if (price[0]*1000 < today.getTime() && price[0]*1000 > yesterday.getTime()) {
            yesterdayPrice.push(price)
        }
        if (price[0]*1000 > lastWeek.getTime()) {
            weekPrices.push(price)
        }
        if (price[0]*1000 > twoWeeks.getTime()) {
            twoWeekPrices.push(price)
        }
        if (price[0]*1000 > lastMonth.getTime()) {
            monthPrices.push(price)
        }
        if (price[0]*1000 > lastYear.getTime()) {
            yearPrices.push(price)
        }
    })
    let dailyChange = 0
    let weeklyChange = 0
    let biweeklyChange = 0
    let monthlyChange = 0
    if (todayPrice.length > 0) {
        if (yesterdayPrice.length > 0) {
            dailyChange = (todayPrice[0][1] - yesterdayPrice[0][1]) / yesterdayPrice[0][1] * 100
        }
    }
    if (weekPrices.length > 0) {
        weeklyChange = (weekPrices[0][1] - weekPrices[weekPrices.length-1][1]) / weekPrices[weekPrices.length-1][1] * 100
    }
    if (twoWeekPrices.length > 0) {
        biweeklyChange = (twoWeekPrices[0][1] - twoWeekPrices[twoWeekPrices.length-1][1]) / twoWeekPrices[twoWeekPrices.length-1][1] * 100
    }
    if (monthPrices.length > 0) {
        monthlyChange = (monthPrices[0][1] - monthPrices[monthPrices.length-1][1]) / monthPrices[monthPrices.length-1][1] * 100
    }

    return {
        keyMarketDates,
        prices: {
            latest: latestPrice,
            today: todayPrice,
            yesterday: yesterdayPrice,
            week: weekPrices,
            twoWeek: twoWeekPrices,
            month: monthPrices
        },
        changes: {
            day: dailyChange,
            week: weeklyChange,
            twoWeek: biweeklyChange,
            month: monthlyChange
        }
    }
}