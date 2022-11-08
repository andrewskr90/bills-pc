import React, { useState } from 'react'
import './assets/search.less'

const Search = (props) => {
    const { submitSearch } = props
    const [searchValue, setSearchValue] = useState('')
    const [categoryValue, setCategoryValue] = useState('All')

    const handleValueChange = (e) => {
        setSearchValue(e.target.value)
    }

    const handleSubmitSearch = (e) => {
        e.preventDefault()
        submitSearch({
            categoryValue: categoryValue,
            searchValue: searchValue
        })
    }

    return (<div className='search'>
        <select className='category' value={categoryValue} onChange={(e) => setCategoryValue(e.target.value)}>
            <option value='All'>All</option>
            <option value='Cards'>Cards</option>
            <option value='Products'>Products</option>
        </select>
        <form onSubmit={handleSubmitSearch}>
            <input className='field' value={searchValue} onChange={handleValueChange}/>
            <button className='submit'>Search</button>
        </form>
    </div>)
}

export default Search