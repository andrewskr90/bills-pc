import React from 'react'
import Filter from '../../components/filter/index.jsx'
import Sort from '../../components/sort/index.jsx'
import RangeSelector from '../../components/range-selector/index.jsx'
import './assets/toolbar.css'
import ToggleRowOrGrid from '../../components/row-or-grid/index.jsx'

const Toolbar = (props) => {
    const { 
        viewRangeSelector, 
        referenceData, 
        setReferenceData,
        sortKey,
        viewToggleRowGrid,
        defaultSortDirection,
        defaultAttribute,
        filterConfig
    } = props

    return (<div className='toolbar'>
        {filterConfig ? <Filter filterConfig={filterConfig} /> : <></>}
        {sortKey ? (
            <Sort 
                sortKey={sortKey} 
                referenceData={referenceData} 
                setReferenceData={setReferenceData} 
                defaultSortDirection={defaultSortDirection} 
                defaultAttribute={defaultAttribute}
            />
        ) : <></>}
        {viewRangeSelector ? <RangeSelector referenceData={referenceData} setReferenceData={setReferenceData} /> : <></>}
        {viewToggleRowGrid ? <ToggleRowOrGrid /> : <></>}
    </div>)
}

export default Toolbar
