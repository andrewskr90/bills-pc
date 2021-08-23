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
    const [cardArray, setCardArray] = useState([])

    const queryKeyName= '?q=name:'
    const queryKeySetId = '?q=set.id:'

    const chooseQuery = (e) => {
        // if(formValues.setName == true) {
        //     setQueryState({
        //         ...queryState,
        //         key: queryKeySetId
        //     })
        // } if(e.target.name== 'pokemonName') {
        //     setQueryState({
        //         ...queryState,
        //         key: queryKeyName
        //     })
        // } else {
        //     setQueryState({
        //         ...queryState,
        //         key: ''
        //     })
        // }
    }

    const handleChange = (e) => {
        setFormValues({
            ...formValues,
            [e.target.name]: `${e.target.value}`
        })
         chooseQuery(e)
    }

    // const filteredArray = (array) => {
        // array.filter(obj => obj.name = 'pikachu')
    // }

    const handleSubmit = (e) => {
        e.preventDefault()
        formValues.setName ? (
            axios.get(`https://api.pokemontcg.io/v2/cards${queryKeySetId}${formValues.setName}`)
                .then(res=>{
                console.log(res.data.data[0].name)
                const result = res.data.data.filter(obj => obj.name === 'weedle')
                console.log(result)
                })
                .catch(err=>console.log(err))
        ) : formValues.pokemonName ? (
            axios.get(`https://api.pokemontcg.io/v2/cards${queryKeyName}${formValues.pokemonName}`)
                .then(res => console.log(res))
                .catch(err => console.log(err))
        ) : (
            axios.get(`https://api.pokemontcg.io/v2/cards`)
                .then(res => console.log(res))
                .catch(err => console.log(err))
        )
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
        </div>
    )
}

export default SearchCards