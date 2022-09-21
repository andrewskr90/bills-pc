import React from 'react'

const RangeSelector = (props) => {
    const { value, marketData, setMarketData } = props

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
        value={value}>{value}</button>
}

export default RangeSelector
