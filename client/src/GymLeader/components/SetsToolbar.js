import React from 'react'
import FilterSets from './FilterSets'

const SetsToolbar = (props) => {

    const { handlePostSetsToSets,
            initialSets, 
            setFilteredSets, 
            filterFormValues, 
            setFilterFormValues,
            setSetsToPost } = props

    return (<>
        <div className='buttonDiv'>
            <p>POST filtered sets to Sets Table</p>
            <button onClick={handlePostSetsToSets}>POST Sets</button>
        </div>
        <FilterSets 
            initialSets={initialSets}
            setFilteredSets={setFilteredSets}
            filterFormValues={filterFormValues}
            setFilterFormValues={setFilterFormValues}
            setSetsToPost={setSetsToPost}
        />
    </>)
}

export default SetsToolbar
