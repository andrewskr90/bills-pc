import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { eligableMarketSearchParams } from '../../utils/params'
import './assets/search.less'

const Search = (props) => {
    const { submitSearch } = props
    const [searchValue, setSearchValue] = useState('')
    const [category, setCategory] = useState('all')
    const location = useLocation()

    const handleValueChange = (e) => {
        setSearchValue(e.target.value)
    }

    const handleSubmitSearch = (e) => {
        e.preventDefault()
        submitSearch({
            category: category,
            value: searchValue
        })
    }

    useEffect(() => {
        const verifyParams = eligableMarketSearchParams(location)
        if (!verifyParams) setCategory('All')
        else setCategory(verifyParams.category)
    }, [])
    
    return (<div className='search'>
        <select className='category' value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value='all'>All</option>
            <option value='cards'>Cards</option>
            <option value='products'>Products</option>
        </select>
        <form onSubmit={handleSubmitSearch}>
            <input className='field' value={searchValue} onChange={handleValueChange}/>
            <button className='submit'>Search</button>
        </form>
    </div>)
}

export default Search