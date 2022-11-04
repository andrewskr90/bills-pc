import React from 'react'

const RangeSelector = (props) => {
    const { value, referenceData, setReferenceData } = props
    let condensedValue
    if (value === 'week') condensedValue = '1W'
    else if (value === 'twoWeek') condensedValue = '2W'
    else if (value === 'month') condensedValue = '1M'

    const handleSelect = (e) => {
        setReferenceData({
            ...referenceData,
            dateRange: e.target.value
        })
    }
    return <button 
        id={value}
        className={`rangeSelector${referenceData.dateRange === value ? ' selected': ''}`} 
        onClick={handleSelect}
        value={value}>{condensedValue}</button>
}

export default RangeSelector
