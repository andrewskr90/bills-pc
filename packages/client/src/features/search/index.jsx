import React, { useState } from 'react'
import './assets/search.css'

const Search = (props) => {
    const { submitSearch } = props
    const [value, setValue] = useState('')

    const handleValueChange = (e) => {
        setValue(e.target.value)
    }

    const handleSubmitSearch = (e) => {
        e.preventDefault()
        submitSearch(value)
    }
    
    return (<div className='search'>
        <form onSubmit={handleSubmitSearch}>
            <input className='field' value={value} onChange={handleValueChange}/>
            <button className='submit'>Search</button>
        </form>
    </div>)
}

export default Search
