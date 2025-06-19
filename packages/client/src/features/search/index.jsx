import React, { useState } from 'react'
import './assets/search.css'
import { buildParams, buildParamString } from '../../utils/location'
import { useLocation, useNavigate } from 'react-router-dom'

const Search = (props) => {
    const { setLoading, marketSearch } = props
    const [value, setValue] = useState('')
    const location = useLocation()
    const params = buildParams(location)
    const navigate = useNavigate()

    const handleValueChange = (e) => {
        setValue(e.target.value)
    }

    const handleSubmitSearch = (e) => {
        e.preventDefault()
        if (value !== params.searchvalue) {
            setLoading(true)
            if (value) {
                params.searchvalue = value
            } else {
                delete params.searchvalue
            }
            params.page = 1
            const builtParamString = buildParamString(params)
            navigate((marketSearch ? '/market/search' : '') + builtParamString)
        }
    }
    
    return (<div className='search'>
        <form onSubmit={handleSubmitSearch}>
            <input className='field' value={value} onChange={handleValueChange}/>
            <button className='submit'>Search</button>
        </form>
    </div>)
}

export default Search
