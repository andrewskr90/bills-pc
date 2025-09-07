import React from 'react'
import { buildQueryParams, buildParamString } from '../../utils/location'
import { useLocation, useNavigate } from 'react-router-dom'

const ToggleRowOrGrid = () => {
    const location = useLocation()
    const queryParams = buildQueryParams(location)
    const navigate = useNavigate()

    const toggleRowGrid = () => {
        if (!queryParams.isgrid) queryParams.isgrid = true
        else delete queryParams.isgrid
        navigate(location.pathname + buildParamString(queryParams))
    }

    return (
        <button className='w-[120px] flex justify-center items-center' onClick={toggleRowGrid}>
            {queryParams.isgrid ? (
                <>Row</>
            ) : (
                <>Grid</>
            )}
        </button>
    )
}

export default ToggleRowOrGrid;
