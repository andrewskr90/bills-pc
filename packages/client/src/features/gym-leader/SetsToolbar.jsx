import React, { useState } from 'react'
import FilterSets from './FilterSets'
import { findPriceTypes } from '../../utils/format-data/pokemon-tcg-io'

const SetsToolbar = (props) => {
    const [priceTypeFormValues, setPriceTypeFormValues] = useState({})
    const { 
        handlePostSetsToSets,
        handlePostAllCardsToCards,
        ptcgioSets, 
        setFilteredSets, 
        filterFormValues, 
        setFilterFormValues } = props
    
    const handleChange = (e) => {
        const key = e.target.name
        setPriceTypeFormValues({
            ...priceTypeFormValues,
            [key]: e.target.value
        })
    }
        
    const handleFindPriceTypes = (e) => {
        e.preventDefault()
        const { bottomIndex, topIndex } = priceTypeFormValues
        findPriceTypes(ptcgioSets, bottomIndex, topIndex)
    }

    return (<div className='setsSidebar sidebar'>
        <div>
            <p>POST all sets to Sets Table</p>
            <button onClick={handlePostSetsToSets}>POST Sets</button>
        </div>
        <div>
            <p>POST all cards to cards Table</p>
            <button onClick={handlePostAllCardsToCards}>POST cards</button>
        </div>
        <div>
            <p>Log card price types</p>
            <form onSubmit={handleFindPriceTypes}>
                <input name='bottomIndex' value={priceTypeFormValues.bottomIndex} type='number' onChange={handleChange}/>
                <input name='topIndex' value={priceTypeFormValues.topIndex} type='number' onChange={handleChange}/>
                <button>Search Price Types</button>
            </form>
            {/* <p>{priceTypes}</p> */}
        </div>
        <FilterSets 
            ptcgioSets={ptcgioSets}
            setFilteredSets={setFilteredSets}
            filterFormValues={filterFormValues}
            setFilterFormValues={setFilterFormValues}
        />
    </div>)
}

export default SetsToolbar
