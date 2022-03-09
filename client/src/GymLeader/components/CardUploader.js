import axios from 'axios'
import Cards from './Cards'
import Sets from './Sets'
import FilterSets from './FilterSets'

import React, { useState, useEffect } from 'react'

const CardUploader = () => {
    const [sets, setSets] = useState([])
    const [filteredSets, setFilteredSets] = useState([])
    const [currentSetCards, setCurrentSetCards] = useState(false)

    useEffect(() => {
        axios.get('https://api.pokemontcg.io/v2/sets')
            .then(res => {
                setSets(res.data.data)
            })
            .catch(err => {
                console.log(err)
            })
    },[])

    const selectSet = (e) => {
        const setId = e.target.value
        axios.get(`https://api.pokemontcg.io/v2/cards?q=set.id:${setId}`)
            .then(res => {
                console.log(res.data.data)
                setCurrentSetCards(res.data.data)
            })
            .catch(err => {
                console.log(err)
            })
    }
    const resetCurrentSet = () => {
        setCurrentSetCards(false)
    }

    return (
        <div className='cardUploader'>
            {!currentSetCards ?
                <>
                    <FilterSets sets={sets} setFilteredSets={setFilteredSets} />
                    <Sets sets={sets} filteredSets={filteredSets} selectSet={selectSet} />
                </>
                :
                <>
                    <Cards resetCurrentSet={resetCurrentSet} currentSetCards={currentSetCards} />
                </>
            }
        </div>
    )
}

export default CardUploader