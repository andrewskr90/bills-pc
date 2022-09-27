import React from 'react'

const SetSelector = (props) => {
    const { marketData, setMarketData } = props

    const handleSelectSet = e => {
        // setSetsVisible(false)
        setMarketData({
            ...marketData,
            selectedSetIndex: Number(e.target.value)
        })
    }

    return (<div className='setSelector'>
        <p>Selected Set: </p>
        <select onChange={handleSelectSet} >
            {marketData.sets.sort((a, b) => {
                if (a.name > b.name) return 1
                if (a.name < b.name) return -1
                return 0
            }).map((set, idx) => <option value={idx}>{set.name}</option>)}
        </select>
    </div>)
}

export default SetSelector
