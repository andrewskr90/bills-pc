import React from 'react'

const SetFilter = ({ filter, removeFilter }) => {

    
    
    return (<div className='filterBubble active'>
            <p>{filter.rarity}</p>
            <button onClick={() => removeFilter(filter)} value={filter}>X</button>
        </div>)
}

export default SetFilter
