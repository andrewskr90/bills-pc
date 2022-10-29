import React from 'react'
import Sort from '../../components/Sort'
import Expansion from './Expansion'
import RangeSelectors from './RangeSelectors'

const ExpansionsMarketplace = (props) => {
    const { marketData, setMarketData } = props

    const sortMarketSetsCB = (a, b) => {
        if (marketData.sort.value === 'topTenAverageToday') {
            if (a.topTenAverage.today === b.topTenAverage.today) return 0
            if (a.topTenAverage.today === null) return 1
            if (b.topTenAverage.today === null) return -1
            if (marketData.sort.direction === 'desc') { 
                return b.topTenAverage.today - a.topTenAverage.today
            } else {
                return a.topTenAverage.today - b.topTenAverage.today
            }
        } else if (marketData.sort.value === 'topTenPercentChange') {
            if (a.topTenPercentChange[marketData.dateRange] === b.topTenPercentChange[marketData.dateRange]) return 0
            if (a.topTenPercentChange[marketData.dateRange] === null) return 1
            if (b.topTenPercentChange[marketData.dateRange] === null) return -1
            if (marketData.sort.direction === 'desc') {
                return Math.abs(b.topTenPercentChange[marketData.dateRange]) - Math.abs(a.topTenPercentChange[marketData.dateRange])
            } else {
                return Math.abs(a.topTenPercentChange[marketData.dateRange]) - Math.abs(b.topTenPercentChange[marketData.dateRange])
            }
        } else if (marketData.sort.value === 'name') {
            if (a.name === b.name) return 0
            if (a.name === null) return 1
            if (b.name === null) return -1
            if (marketData.sort.direction === 'asc') { 
                if (a.name.toLowerCase() > b.name.toLowerCase()) return 1
                else return -1
            } else {
                if (a.name.toLowerCase() < b.name.toLowerCase()) return 1
                else return -1
            }
        } else if (marketData.sort.value === 'release_date') {
            if (a.release_date === b.release_date) return 0
            if (a.release_date === null) return 1
            if (b.release_date === null) return -1
            if (marketData.sort.direction === 'desc') { 
                return Date.parse(b.release_date) - Date.parse(a.release_date)
            } else {
                return Date.parse(a.release_date) - Date.parse(b.release_date)
            }
        }
    }
    
    return (<div className='expansionsMarketplace'>
        <div className='title'>
            <h3>Pokemon Expansions</h3>
            <p>Top 10 Card Averages</p>
        </div>
        <div className='toolbar'>
            <RangeSelectors marketData={marketData} setMarketData={setMarketData} />
            <Sort dataObject={marketData} setDataObject={setMarketData} />
        </div>
        <div className='expansions'>
            {marketData.sets.sort(sortMarketSetsCB).map(marketDataSet => <Expansion marketData={marketData} marketDataSet={marketDataSet} />)}
        </div>
    </div>)
}

export default ExpansionsMarketplace
