import React from 'react'
import SetFilter from './SetFilter'

const SetFilters = (props) => {
    const { marketData, setMarketData, openFilterModal } = props

    const removeFilter = (filterToRemove) => {
        const updatedFilters = marketData.filters.filter(filterToCompare => {
            let keyToCompare = Object.keys(filterToCompare)[0]
            let valueToCompare = filterToCompare[keyToCompare]
            let keyToRemove = Object.keys(filterToRemove)[0]
            let valueToRemove = filterToRemove[keyToRemove]
            if (keyToCompare !== keyToRemove) {
                return filterToCompare
            } else {
                if (valueToCompare !== valueToRemove) {
                    return filterToCompare
                }
            }
        })
        setMarketData({
            ...marketData,
            filters: updatedFilters
        })
    }

    return (<div className='setFilters'>
        <button className='addFilter' onClick={openFilterModal}>Filters</button>
        <div className='filterBubbles'>
            {marketData.filters.map((filter, idx) => {
                return <SetFilter key={idx} filter={filter} removeFilter={removeFilter} />
            })}
        </div>
    </div>)
}

export default SetFilters
