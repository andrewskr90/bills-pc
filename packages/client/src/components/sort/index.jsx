import React from 'react'
import './assets/sort.css'
import { buildQueryParams, buildParamString } from '../../utils/location'
import { useLocation, useNavigate } from 'react-router-dom'

const Sort = (props) => {
    const { referenceData, setReferenceData, sortKey, defaultSortDirection, defaultAttribute } = props
    const location = useLocation()
    const navigate = useNavigate()

    const queryParams = buildQueryParams(location)

    const handleChangeValue = (e) => {
        queryParams.attribute = e.target.value
        navigate(location.pathname + buildParamString(queryParams))
    }

    const toggleDirection = (e) => {
        if (e.currentTarget.value === 'asc') {
            queryParams.direction = 'desc'
        } else {
            queryParams.direction = 'asc'
        }
        navigate(location.pathname + buildParamString(queryParams))
    }

    const directionValue = queryParams.direction ? queryParams.direction.toLowerCase() : defaultSortDirection
    const attributeValue = queryParams.attribute ? queryParams.attribute.toLowerCase() : defaultAttribute
    return (<div className='sort'>
        <button className='direction' value={directionValue} onClick={toggleDirection}>
            {directionValue === 'asc'
                ? <i className='downArrow' /> 
                : <i className= 'upArrow' />}
        </button>
        <select className='value' onChange={handleChangeValue}>
            {Object.keys(referenceData[sortKey].values).map(value => {
                if (attributeValue === value.toLowerCase()) return <option value={value} selected>{referenceData[sortKey].values[value].formatted}</option>
                return <option value={value}>{referenceData[sortKey].values[value].formatted}</option>
            })}
        </select>
    </div>)
}

export default Sort
