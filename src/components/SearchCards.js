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
        if(formValues.setName) {
            console.log('it exists')
            console.log(queryKeySetId)
            setQueryState({
                ...queryState,
                key: queryKeySetId
            })
            console.log(queryState)
        } if(e.target.name== 'pokemonName') {
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

    const handleChange = (e) => {
        setFormValues({
            ...formValues,
            [e.target.name]: `${e.target.value}`
        })
         chooseQuery(e)
    }


    console.log(formValues)
    console.log(queryState)

    const handleSubmit = (e) => {
        e.preventDefault()
        if(formValues.setName){
            console.log('it exists')
        }
            // axios.get(`https://api.pokemontcg.io/v2/cards${queryState.key}${formValues.pokemonName}`)
            axios.get(`https://api.pokemontcg.io/v2/cards${queryState}`)
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
                    <select
                        name='setName'
                        onChange={handleChange}
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