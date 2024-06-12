import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import BillsPcService from '../../api/bills-pc'
import PtcgioService from '../../api/pokemon-tcg-io'
import { formatCardsArray, formatSetsArray } from '../../utils/format-data/pokemon-tcg-io'
import SetsToolbar from './SetsToolbar'
import CardsToolbar from './CardsToolbar'
import Sets from './Sets'
import Cards from './Cards'

const initialFilterFormValues = {
    setSubstring: ''
}

const PtcgioManager = () => {
    const [ptcgioSets, setPtcgioSets] = useState([])
    const [currentSetCards, setCurrentSetCards] = useState([])
    const [filteredSets, setFilteredSets] = useState([])
    const [filterFormValues, setFilterFormValues] = useState(initialFilterFormValues)

    useEffect(() => {
        PtcgioService.getSets()
            .then(res => {
                setPtcgioSets(res.data.data)
            })
            .catch(err => console.log(err))
    },[])

    useEffect(() => {
        setFilteredSets(ptcgioSets)
    },[ptcgioSets])

    const handlePostSetsToSets = () => {
        //pokemonapi.io data formatted, and posted to billspc api
        const formattedSets = formatSetsArray(ptcgioSets)
        const sets = formattedSets
        BillsPcService.postSetsToSets(sets)
            .then(res => {
                console.log(res)
            })
            .catch(err => console.log(err.message))
    }

    const postSetCardsToBPC = async (cards) => {
        BillsPcService.postCardsToCards(cards)
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const handlePostCardsToCards = async () => {
        postSetCardsToBPC(currentSetCards)
    }

    const handlePostAllCardsToCards = async () => {
        for (let i=0; i<ptcgioSets.length; i++) {
            const set_ptcgio_id = ptcgioSets[i].id
            let set_id
            let cardsFromSet
            
            await BillsPcService.getSetsBy({ set_ptcgio_id })
                .then(res => {
                    set_id = res.data[0].set_id
                })
            await PtcgioService.getCardsFromSet(set_ptcgio_id)
                .then(res => cardsFromSet = res.data.data)
                .catch(err => console.log(err))
            const formattedCardsArray = formatCardsArray(cardsFromSet, set_id)
            postSetCardsToBPC(formattedCardsArray)
            await new Promise(resolve => {
                setTimeout(() => {
                    resolve()
                }, 2000)
            })
        }
    }

    return (<div className='ptcgioManager'>
        <Routes>
            <Route path='/' element={
                <SetsToolbar 
                    ptcgioSets={ptcgioSets}
                    setFilteredSets={setFilteredSets}
                    filterFormValues={filterFormValues}
                    setFilterFormValues={setFilterFormValues}
                    handlePostSetsToSets={handlePostSetsToSets}
                    handlePostAllCardsToCards={handlePostAllCardsToCards}
                />
            } />
            <Route path='/:setId' element={
                <CardsToolbar 
                    handlePostCardsToCards={handlePostCardsToCards} 
                />
            } />
        </Routes>
        <Routes>
                <Route path='/' element={<Sets filteredSets={filteredSets} setCurrentSetCards={setCurrentSetCards} />} />
                <Route path='/:setId/*' element={
                    <Cards 
                        currentSetCards={currentSetCards}
                        setCurrentSetCards={setCurrentSetCards}
                    />
                } />
            </Routes>
    </div>)
}

export default PtcgioManager
