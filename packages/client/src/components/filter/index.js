import React, { useState } from 'react'
import FilterModal from './FilterModal'
import { countFilters } from '../../utils/filter'
import './assets/filter.less'

const Filter = (props) => {
    const { 
        referenceData,
        setReferenceData,
        filterKey
    } = props
    const [showFilterModal, setShowFilterModal] = useState(false)
    const filterCount = countFilters(referenceData.filter[filterKey])

    const openFilterModal = () => {
        setShowFilterModal(true)
    }

    return (<div className='filter'>
        <button className='openFilterModal' onClick={openFilterModal}>
            <p>Filter</p>
            {filterCount
            ?
            <div className='filterCount'>{filterCount}</div>
            :
            <></>}
        </button>
        <FilterModal 
            referenceData={referenceData} 
            setReferenceData={setReferenceData}
            showFilterModal={showFilterModal} 
            setShowFilterModal={setShowFilterModal}
            filterKey={filterKey}
        />
    </div>)
}

export default Filter
