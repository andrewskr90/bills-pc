import React, { useState, useEffect } from 'react'
import axios from 'axios';

const initialFormValues = {
    pokemonName:'',
    setName:'',
    setNumber:''
}
const initialQueryState = {
    key:''
}

const SearchCards = () => {
    const [formValues, setFormValues] = useState(initialFormValues)
    const [queryState, setQueryState] = useState(initialQueryState)

    const queryKeyName= '?q=name:'
    const queryKeySetId = '?q=set.id:'

    const handleChange = (e) => {
        setFormValues({
            ...formValues,
            [e.target.name]: `${e.target.value}`
        })
        if(e.target.value) {
            setQueryState({
                ...queryState,
                key: queryKeyName
            })
        } else {
            setQueryState({
                ...queryState,
                key: ''
            })
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
            // axios.get(`https://api.pokemontcg.io/v2/cards${queryState.key}${formValues.pokemonName}`)
            axios.get(`https://api.pokemontcg.io/v2/cards${queryKeySetId}gym2`)
            .then(res=>{
            console.log(res)
            })
            .catch(err=>console.log(err))
        
    }

    return(
        <div>
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
                    <input
                        name='setName'
                        type='text'
                        value={formValues.setName}
                        onChange={handleChange}
                    />
                </label>
                <button>Search</button>
            </form>
        </div>
    )
}

export default SearchCards