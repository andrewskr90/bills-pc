import React from 'react'

const RangeSelector = (props) => {
    const { value, marketData, setMarketData } = props

    let condensedValue
    if (value === 'week') condensedValue = '1W'
    else if (value === 'twoWeek') condensedValue = '2W'
    else if (value === 'month') condensedValue = '1M'

    const handleSelect = (e) => {
        setMarketData({
            ...marketData,
            dateRange: e.target.value
        })
    }
    return <button 
        id={value}
        className={`rangeSelector${marketData.dateRange === value ? ' selected': ''}`} 
        onClick={handleSelect}
        value={value}>{condensedValue}</button>
}

export default RangeSelector
