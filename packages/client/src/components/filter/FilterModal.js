import React from 'react'
import { camelCaseToCapitalized } from '../../utils/string'

const FilterModal = (props) => {
    const { referenceData, setReferenceData, showFilterModal, setShowFilterModal, filterKey } = props

    const toggleFilter = (filterType, filter) => {
        setReferenceData({
            ...referenceData,
            filter: {
                ...referenceData.filter,
                [filterKey]: {
                    ...referenceData.filter[filterKey],
                    [filterType]: {
                        ...referenceData.filter[filterKey][filterType],
                        [filter]: !referenceData.filter[filterKey][filterType][filter]
                    }
                }
            }
        })
    }

    const clearFilters = () => {
        setReferenceData({
            ...referenceData,
            [filterKey]: []
        })
    }

    return (<div className={showFilterModal ? 'modalBackground' : 'hidden'}>
        <div className='modalContent filterModal'>
            <h2>Filters</h2>
            {Object.keys(referenceData.filter[filterKey]).map(filterType => {
                return <div className='filterSection'>
                    <p>{camelCaseToCapitalized(filterType)}</p>
                    <div className='filterBubbles'>
                        {Object.keys(referenceData.filter[filterKey][filterType]).map(filter => {
                            return <div className={`filterBubble ${referenceData.filter[filterKey][filterType][filter] ? 'active' : ''}`} onClick={() => toggleFilter(filterType, filter)}>
                                <p>{camelCaseToCapitalized(filter)}</p>
                            </div>
                        })}
                    </div>
                </div>
            })}
            <div className='clearAndClose'>
                <button onClick={clearFilters}>Clear All</button>
                <button onClick={() => setShowFilterModal(false)}>Close</button>
            </div>
        </div>
    </div>)
}

export default FilterModal
