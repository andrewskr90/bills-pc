import React from 'react'

const SetFilters = (props) => {
    const { openFilterModal } = props

    return (<div className='setFilters'>
        <button className='addFilter' onClick={openFilterModal}>Filters</button>
    </div>)
}

export default SetFilters
