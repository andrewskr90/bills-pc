import React, { useState } from 'react'

const SetSelector = (props) => {
    const { marketData, setMarketData } = props

    const handleSelectSet = e => {
        // setSetsVisible(false)
        setMarketData({
            ...marketData,
            selectedSetIndex: e.target.value
        })
    }

    return (<div className='setSelector'>
        <select onChange={handleSelectSet} >
            {marketData.sets.map((set, idx) => <option value={idx}>{set.name}</option>)}
        </select>
    </div>)
}

export default SetSelector
