import React from 'react'
import './assets/sort.css'
import { buildParams, buildParamString } from '../../utils/location'
import { useLocation, useNavigate } from 'react-router-dom'

const Sort = (props) => {
    const { referenceData, setReferenceData, sortKey, defaultSortDirection, defaultAttribute } = props
    const location = useLocation()
    const navigate = useNavigate()

    const params = buildParams(location)

    const handleChangeValue = (e) => {
        params.attribute = e.target.value
        navigate(location.pathname + buildParamString(params))
    }

    const toggleDirection = (e) => {
        if (e.currentTarget.value === 'asc') {
            params.direction = 'desc'
        } else {
            params.direction = 'asc'
        }
        navigate(location.pathname + buildParamString(params))
    }

    const directionValue = params.direction ? params.direction.toLowerCase() : defaultSortDirection
    const attributeValue = params.attribute ? params.attribute.toLowerCase() : defaultAttribute
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
