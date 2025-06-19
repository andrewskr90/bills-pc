import React from 'react'
import { buildParams, buildParamString } from '../../utils/location'
import { useNavigate } from 'react-router-dom'

const PageSelection = (props) => {
    const { location, count } = props
    const navigate = useNavigate()
    const params = buildParams(location)
    const handleChangePage = (pageNumber) => {
        params.page = pageNumber
        navigate(location.pathname + buildParamString(params))                   
    }
    const pageNumber = parseInt(buildParams(location).page) || 1
    return (
        <div className='flex flex-row justify-between w-full'>
            {parseInt(buildParams(location).page) > 1 ? <button onClick={() => handleChangePage(pageNumber-1)}>Prev</button> : <div></div>}
            {pageNumber*20 < count ? <button onClick={() => handleChangePage(pageNumber ? pageNumber + 1 : 2)}>Next</button> : <div></div>}
        </div>
    )
}

export default PageSelection
