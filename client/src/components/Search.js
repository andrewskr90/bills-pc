import React, { useState, useEffect } from 'react'
import axios from 'axios';

import SearchResults from './SearchResults';
import SearchedCardPage from './SearchedCardPage';

const initialFormValues = {
    pokemonName:'',
    setName:'',
    setNumber:''
}
const initialQueryState = {
    key:''
}

const Search = (props) => {
    const [formValues, setFormValues] = useState(initialFormValues)
    const [queryState, setQueryState] = useState(initialQueryState)
    const [cardArray, setCardArray] = useState([])
    const [searchedCardSelect, setSearchedCardSelect] = useState({})

    const { setMyCollectionArray, myCollectionArray } = props

    const queryKeyName= '?q=name:'
    const queryKeySetId = '?q=set.id:'

    const handleChange = (e) => {
        setFormValues({
            ...formValues,
            [e.target.name]: `${e.target.value}`
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        formValues.setName ? (
            axios.get(`https://api.pokemontcg.io/v2/cards${queryKeySetId}${formValues.setName}`)
                .then(res=>{
                    console.log(res)
                    const result = res.data.data.filter(obj => obj.name.includes(formValues.pokemonName.charAt(0).toUpperCase()) )
                    setCardArray(result)
                })
                .catch(err=>console.log(err))
        ) : formValues.pokemonName ? (
            axios.get(`https://api.pokemontcg.io/v2/cards${queryKeyName}${formValues.pokemonName}`)
                .then(res => {setCardArray(res.data.data); console.log(cardArray)})
                .catch(err => console.log(err))
        ) : (
            axios.get(`https://api.pokemontcg.io/v2/cards`)
                .then(res => console.log(res))
                .catch(err => console.log(err))
        )
    }

    return(
        <div>
            <h2>Search</h2>
            <form onSubmit={handleSubmit}>
                <label>Pokemon Name
                    <input
                        name='pokemonName'
                        type='text'
                        value={formValues.pokemonName}
                        onChange={handleChange}
                    />
                </label>
                <label>Set
                    <select
                        name='setName'
                        onChange={handleChange}
                        value={formValues.setName}
                    >
                        <option value=''>--select--</option>
                        <option value='swsh4'>Vivid Voltage</option>
                        <option value='swsh3'>Darkness Ablaze</option>
                        </select>
                </label>
                <button>Search</button>
            </form>
            <SearchResults setSearchedCardSelect={setSearchedCardSelect} cardArray={cardArray} />
            {/* <SearchedCardPage myCollectionArray={myCollectionArray} setMyCollectionArray={setMyCollectionArray} searchedCardSelect={searchedCardSelect} /> */}
        </div>
    )
}

export default Search