import React, { useState } from 'react'
import './assets/search.less'

const Search = (props) => {
    const { submitSearch } = props
    const [searchValue, setSearchValue] = useState('')

    const handleValueChange = (e) => {
        setSearchValue(e.target.value)
    }

    const handleSubmitSearch = (e) => {
        e.preventDefault()
        submitSearch(searchValue)
    }
    
    return (<div className='search'>
        <form onSubmit={handleSubmitSearch}>
            <input className='field' value={searchValue} onChange={handleValueChange}/>
            <button className='submit'>Search</button>
        </form>
    </div>)
}

export default Search
