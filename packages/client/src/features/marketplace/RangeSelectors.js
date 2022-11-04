import React, { useEffect, useState } from 'react'
import RangeSelector from './RangeSelector'

const RangeSelectors = (props) => {
    const { referenceData, setReferenceData } = props
    const rangeValues = ['week', 'twoWeek', 'month']

    return(<div className='rangeSelectors'>
        {rangeValues.map(value => {
            return <RangeSelector 
                key={value}
                value={value} 
                referenceData={referenceData}
                setReferenceData={setReferenceData}
            />
        })}
    </div>)
}

export default RangeSelectors
