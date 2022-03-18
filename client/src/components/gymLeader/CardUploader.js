import Cards from './Cards'
import Sets from './Sets'
import CardsToolbar from './CardsToolbar'
import SetsToolbar from './SetsToolbar'
import { getSets, getCardsFromSet } from '../../api/pokemon-tcg-io'
import { postCardsToCards, postSetsToSets } from '../../api/bills-pc'
import { formatCardsArray, formatSetsArray } from '../../utils/format-data/pokemon-tcg-io'

import React, { useState, useEffect } from 'react'

const initialFilterFormValues = {
    setSubstring: ''
}

const CardUploader = () => {
    const [initialSets, setInitialSets] = useState([])
    const [currentSetCards, setCurrentSetCards] = useState([])
    const [formattedCurrentSetCards, setFormattedCurrentSetCards] = useState([])
    const [filteredSets, setFilteredSets] = useState(initialSets)
    const [filterFormValues, setFilterFormValues] = useState(initialFilterFormValues)
    const [currentSetObject, setCurrentSetObject] = useState(false)
    const [setsToPost, setSetsToPost] = useState([])

    useEffect(() => {
        getSets()
            .then(res => {
                setInitialSets(res.data.data)
            })
            .catch(err => console.log(err))
    },[])

    useEffect(() => {
        setFilteredSets(initialSets)
        setSetsToPost(initialSets)
    },[initialSets])

    useEffect(() => {
        formatCardsArray(currentSetCards)
            .then(res => {
                setFormattedCurrentSetCards(res)
            })
            .catch(err => console.log(err))
    },[currentSetCards])

    const selectSet = (e) => {
        const setId = e.target.value
        const [setObject] = initialSets.filter(set => {
            return set.id === setId
        })
        setCurrentSetObject(setObject)
        getCardsFromSet(setId)
            .then(res => {
                console.log(res)
                setCurrentSetCards(res.data.data)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const resetCurrentSet = () => {
        setCurrentSetCards([])
    }
    //pokemonapi.io data formatted, and posted to billspc api
    const formattedSets = formatSetsArray(setsToPost)

    const handlePostSetsToSets = () => {
        postSetsToSets(formattedSets)
            .then(res => console.log(res))
            .catch(err => console.log(err.message))
    }

    const handlePostCardsToCards = () => {
        postCardsToCards(formattedCurrentSetCards)
            .then(res => console.log(res))
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <div className='cardUploader'>
            {currentSetCards.length === 0 ?
                <>
                    <SetsToolbar
                        initialSets={initialSets}
                        setFilteredSets={setFilteredSets}
                        setSetsToPost={setSetsToPost}
                        filterFormValues={filterFormValues}
                        setFilterFormValues={setFilterFormValues}
                        handlePostSetsToSets={handlePostSetsToSets}
                    />
                    <Sets 
                        filteredSets={filteredSets} 
                        selectSet={selectSet} />
                </>
                :
                <>
                    <CardsToolbar 
                        handlePostCardsToCards={handlePostCardsToCards} 
                        resetCurrentSet={resetCurrentSet} 
                        currentSetObject={currentSetObject} />
                    <Cards 
                        currentSetCards={currentSetCards} />
                </>
            }
        </div>
    )
}

export default CardUploader