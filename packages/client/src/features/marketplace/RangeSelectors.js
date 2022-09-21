import React, { useEffect, useState } from 'react'
import RangeSelector from './RangeSelector'

const RangeSelectors = (props) => {
    const { marketData, setMarketData } = props
    const rangeValues = ['1D', '1W', '1M']

    return(<div className='rangeSelectors'>
        {rangeValues.map(value => {
            return <RangeSelector 
                key={value}
                value={value} 
                marketData={marketData}
                setMarketData={setMarketData}
            />
        })}
    </div>)
}

export default RangeSelectors
