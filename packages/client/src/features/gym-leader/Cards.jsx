import React, { useState, useEffect } from 'react'
import { Routes, Route, useParams } from 'react-router-dom'
import PtcgioService from '../../api/pokemon-tcg-io'
import Card from './Card'
import CardInfo from './CardInfo'

const Cards = (props) => {
    const { currentSetCards, setCurrentSetCards } = props
    const { setId } = useParams()

    useEffect(() => {
        PtcgioService.getCardsFromSet(setId)
            .then(res => {
                console.log(res)
                setCurrentSetCards(res.data.data)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])
    
    return (<div className='panel cards'>
        {currentSetCards.length === 0
        ?
        <h2>Loading...</h2>
        :
        <Routes>
            <Route path='/' element={<>{currentSetCards.map(card => {
            return <Card key={card.id} card={card} />
        })}</>} />
            <Route path='/:cardNumber' element={<CardInfo currentSetCards={currentSetCards}/>} />
        </Routes>
        }
    </div>)
}

export default Cards