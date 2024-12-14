import React, { useState } from 'react'
import FilterModal from './FilterModal.jsx'
import './assets/filter.css'
import { useLocation } from 'react-router-dom'
import { buildParams } from '../../utils/location/index.js'
import { countFilters } from './utils/index.js'

const Filter = (props) => {
    const { filterConfig } = props
    const [showFilterModal, setShowFilterModal] = useState(false)
    const location = useLocation()
    const params = buildParams(location)
    const filterCount = countFilters(filterConfig, params)

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
            showFilterModal={showFilterModal} 
            setShowFilterModal={setShowFilterModal}
            filterConfig={filterConfig}
        />
    </div>)
}

export default Filter
