import React, { useEffect, useState } from 'react'
import './assets/RangeSelector.less'

const RangeSelector = (props) => {
    const { referenceData, setReferenceData } = props
    const rangeValues = ['week', 'twoWeek', 'month']

    const handleSelect = (e) => {
        setReferenceData({
            ...referenceData,
            dateRange: e.target.value
        })
    }

    return(<div className='rangeSelectors'>
        {rangeValues.map(value => {
            let condensedValue
            if (value === 'week') condensedValue = '1W'
            else if (value === 'twoWeek') condensedValue = '2W'
            else if (value === 'month') condensedValue = '1M'

            return <button 
                id={value}
                className={`rangeSelector${referenceData.dateRange === value ? ' selected': ''}`} 
                onClick={handleSelect}
                value={value}>{condensedValue}
            </button>
        })}
    </div>)
}

export default RangeSelector
