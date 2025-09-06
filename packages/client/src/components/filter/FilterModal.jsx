import React from 'react'
import { camelCaseToCapitalized } from '../../utils/string'
import { useLocation, useNavigate } from 'react-router-dom'
import { buildQueryParams, buildParamString } from '../../utils/location'
import { checkIfFilterIsActive } from './utils'

const FilterModal = (props) => {
    const { showFilterModal, setShowFilterModal, filterConfig } = props
    const location = useLocation()
    const queryParams = buildQueryParams(location)
    const navigate = useNavigate()

    const toggleFilter = (filterType, filter) => {
        const conditionedFilterType = filterType.toLowerCase()
        const conditionedFilter = filter.toLowerCase()
        if (queryParams[`filter-${conditionedFilterType}`]) {
            if (queryParams[`filter-${conditionedFilterType}`].includes(conditionedFilter)) {
                queryParams[`filter-${conditionedFilterType}`] = 
                    queryParams[`filter-${conditionedFilterType}`]
                        .split(',')
                        .filter(existingFilter => existingFilter !== conditionedFilter)
                        .join(',')
            } else {
                queryParams[`filter-${conditionedFilterType}`] += `,${conditionedFilter.toLowerCase()}`
            }
        } else {
            queryParams[`filter-${conditionedFilterType}`] = conditionedFilter.toLowerCase()
        }
        navigate(location.pathname + buildParamString(queryParams))
    }

    return (<div className={showFilterModal ? 'modalBackground' : 'hidden'}>
        <div className='modalContent filterModal'>
            <h2>Filters</h2>
            {(Object.keys(filterConfig).map(filterType => {
                return <div className='filterSection'>
                    <p>{camelCaseToCapitalized(filterType)}</p>
                    <div className='filterBubbles'>
                        {filterConfig[filterType].map(filter => {
                            return <div className={`filterBubble ${checkIfFilterIsActive(filterType, filter, queryParams) ? 'active' : ''}`} onClick={() => toggleFilter(filterType, filter)}>
                                {/* filter keys are already formatted */}
                                <p>{filter}</p>
                            </div>
                        })}
                    </div>
                </div>
            }))}
            <div className='clearAndClose'>
                <button onClick={() => navigate(location.pathname)}>Clear All</button>
                <button onClick={() => setShowFilterModal(false)}>Close</button>
            </div>
        </div>
    </div>)
}

export default FilterModal
