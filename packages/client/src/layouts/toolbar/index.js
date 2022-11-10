import React from 'react'
import Filter from '../../components/filter'
import Sort from '../../components/sort'
import RangeSelector from '../../components/range-selector'
import './assets/toolbar.less'

const Toolbar = (props) => {
    const { 
        viewSort, 
        viewRangeSelector, 
        filterKey,
        referenceData, 
        setReferenceData,
        dataObject, 
        setDataObject, 
        sortKey
    } = props

    return (<div className='toolbar'>
        {filterKey ? <Filter filterKey={filterKey} referenceData={referenceData} setReferenceData={setReferenceData} /> : <></>}
        {viewSort ? <Sort sortKey={sortKey} dataObject={dataObject} setDataObject={setDataObject} referenceData={referenceData} setReferenceData={setReferenceData} /> : <></>}
        {viewRangeSelector ? <RangeSelector referenceData={referenceData} setReferenceData={setReferenceData} /> : <></>}
    </div>)
}

export default Toolbar
