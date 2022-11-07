import React, { useState } from 'react'
import FilterModal from './FilterModal'
import './assets/filter.less'

const Filter = (props) => {
    const { 
        referenceData,
        setReferenceData,
        // showFilterModal,
        // setShowFilterModal,
        filterKey
    } = props
    const [showFilterModal, setShowFilterModal] = useState(false)


    const openFilterModal = () => {
        setShowFilterModal(true)
    }

    return (<div className='filter'>
        <button className='openFilterModal' onClick={openFilterModal}>
            <p>Filter</p>
            {referenceData.expansionItemFilters.length > 0
            ?
            <div className='filterCount'>{referenceData.expansionItemFilters.length}</div>
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
