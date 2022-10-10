import React, { useEffect, useState } from 'react'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'

import Login from './pages/Login'
import GymLeaderHome from './pages/GymLeaderHome'
import GymLeaderRoute from './utils/auth/GymLeaderRoute'
import Marketplace from './features/marketplace'
import Collection from './features/collection'
import NavBar from './layouts/NavBar'

import BillsPcService from './api/bills-pc'
import './styles/App.less'
import InDevelopment from './pages/InDevelopment'

const initialReferenceDataValues = {
    sets: [],
    cards: [],
    products: [],
    rarities: []
}

const initialMarketData = {
    // initially set to -1 so change registers, triggering useEffect
    selectedSetIndex: -1,
    dateRange: '1W',
    sets: [],
    filters: []
}

//calling api before app renders can lead to bugs
//render app first, call data in useEffect,
//then set initialData to true
let initialData = false

const formatSetsForMarketData = (sets) => {
    const formattedSets = sets.map(set => {
        return {
            id: set.set_v2_id,
            name: set.set_v2_name,
            items: [],
        }
    })
    return formattedSets
}


const updateSetWithFetchedMarketData = (set, marketPrices) => {
    const itemsWithPrices = []
    marketPrices.forEach(item => {
        itemsWithPrices.push({
            card_id: item.card_v2_id,
            name: item.card_v2_name || item.product_name,
            number: item.card_v2_number,
            rarity: item.card_v2_rarity,
            foil_only: item.card_v2_foil_only,
            product_id: item.product_id,
            release_date: item.product_release_date,
            description: item.product_description,
            market_prices: item.market_price_prices,
            tcgplayer_product_id: item.tcgplayer_product_id
        })
    })
    return {
        id: set.id,
        name: set.name,
        items: itemsWithPrices
    }
}


const App = () => {
    const [userClaims, setUserClaims] = useState(false)
    const navigate = useNavigate()
    const [collectedCards, setCollectedCards] = useState([])
    const [referenceData, setReferenceData] = useState(initialReferenceDataValues)
    const [marketData, setMarketData] = useState(initialMarketData)

    useEffect(() => {
        const checkAuth = async () => {
            await BillsPcService.authenticateSession()
                .then(res =>  {
                    initialData = true
                    setUserClaims(res.data)
                }).catch(err => {
                    initialData = true
                })
        }
        checkAuth()
        // BillsPcService.getCollectedCards()
        //     .then(res => {
        //         setCollectedCards(res.data)
        //     })
        // BillsPcService.getSets()
        //     .then(res => {
        //         setReferenceData({
        //             ...referenceData,
        //             sets: res.data
        //         })
        //     })
        const getReferenceData = async () => {
            await BillsPcService.getReferenceData()
                .then(res => {
                    setReferenceData(res.data)
                    setMarketData({
                        ...marketData,
                        selectedSetIndex: 0,
                        sets: formatSetsForMarketData(res.data.sets),
                    })
                }).catch(err => {
                    console.log(err)
                })
        }
        getReferenceData()
        const getTopTenAverageMarketData = async () => {
            await BillsPcService.getMarketPrices({ topTenAverage: true })
                .then(res => console.log(res))
                .catch(err => console.log(err))
        }
        getTopTenAverageMarketData()
    }, [])
    
    const getSetMarketData = async (set_id) => {
        await BillsPcService.getMarketPrices({ set_v2_id: set_id })
            .then(res => {
                setMarketData({
                    ...marketData,
                    sets: marketData.sets.map(set => {
                        if (set.id === set_id) {
                            return updateSetWithFetchedMarketData(set, res.data)
                        } else {
                            return set
                        }
                    })
                })
            }).catch(err => {
                console.log(err)
            })        
    }

    useEffect(() => {
        if (marketData.sets.length > 0) {
            getSetMarketData(marketData.sets[marketData.selectedSetIndex].id)
        }
    }, [marketData.selectedSetIndex])

    return (<>
        <div className='app'>
            <header>
                <h1>Bill's PC</h1>
                <p>Pokemon Card Portfolio App</p>
            </header>
            <Routes>
                <Route path='/' element={<Marketplace marketData={marketData} setMarketData={setMarketData} referenceData={referenceData} />} />
                {/* <Route path='/collection' element={<Collection userClaims={userClaims} collectedCards={collectedCards} setCollectedCards={setCollectedCards} />} /> */}
                <Route path='/collection' element={<InDevelopment />} />
                <Route path='/login' element={<Login setUserClaims={setUserClaims} />} />
            </Routes>
            <NavBar />
        </div>
    </>)
}

export default App
