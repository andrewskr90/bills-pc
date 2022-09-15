import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import BillsPcService from '../api/bills-pc'
import NavBar from '../layouts/NavBar'
import Collection from '../features/collection'
import ImportPurchase from '../features/import-purchase/index.js'
import Profile from '../features/profile'

const initialReferenceDataValues = {
    sets: [],
    cards: [],
    products: []
}

const Home = (props) => {
    const { userClaims } = props
    const [collectedCards, setCollectedCards] = useState([])
    const [referenceData, setReferenceData] = useState(initialReferenceDataValues)

    useEffect(() => {
        BillsPcService.getCollectedCards()
            .then(res => {
                setCollectedCards(res.data)
            })
        BillsPcService.getSets()
            .then(res => {
                setReferenceData({
                    ...referenceData,
                    sets: res.data
                })
            }).catch(err => {
                console.log(err)
            })
        
    }, [])
    
    return (<div className='home'>
        <header>
            <h1>Bill's PC</h1>
        </header>
        <Routes>
            <Route path='/' element={<Collection userClaims={userClaims} collectedCards={collectedCards} />} />
            <Route 
                path='/import/*' 
                element={<ImportPurchase 
                    setCollectedItems={setCollectedCards} 
                    referenceData={referenceData}
                    setReferenceData={setReferenceData}
                />} 
            />
            <Route 
                path='/profile' 
                element={<Profile 
                    userClaims={userClaims} 
                />} 
            />
        </Routes>
        <NavBar />
    </div>)
}

export default Home
