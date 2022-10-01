import React, { useEffect, useState } from 'react'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'

import Home from './pages/Home'
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
    products: []
}

const initialMarketData = {
    // initially set to -1 so change registers, triggering useEffect
    selectedSetIndex: -1,
    dateRange: '1W',
    sets: []
}

//calling api before app renders can lead to bugs
//render app first, call data in useEffect,
//then set initialData to true
let initialData = false

const App = () => {
    const [userClaims, setUserClaims] = useState(false)
    const navigate = useNavigate()
    const [collectedCards, setCollectedCards] = useState([])
    const [referenceData, setReferenceData] = useState(initialReferenceDataValues)
    const [marketData, setMarketData] = useState(initialMarketData)

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

    useEffect(() => {
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
        BillsPcService.getSetsV2()
            .then(res => {
                // setReferenceData({
                //     ...referenceData,
                //     sets: res.data
                // })
                setMarketData({
                    ...marketData,
                    selectedSetIndex: 0,
                    sets: formatSetsForMarketData(res.data)
                })
            }).catch(err => {
                console.log(err)
            })
    }, [])

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
                market_prices: item.market_price_prices
            })
        })
        return {
            id: set.id,
            name: set.name,
            items: itemsWithPrices
        }
    }

    const getSetMarketData = (set_id) => {
        BillsPcService.getMarketPrices({ set_v2_id: set_id, marketwatch: true })
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

    useEffect(() => {
        const checkAuth = async () => {
            await BillsPcService.authenticateSession()
                .then(res =>  {
                    initialData = true
                    setUserClaims(res.data)
                }).catch(err => {
                    initialData = true
                    // navigate('/login')
                })
        }
        checkAuth()
    }, [])

    return (<>
        <div className='app'>
            <header>
                <h1>Bill's PC</h1>
                <p>Pokemon Card Portfolio App</p>
            </header>
            <Routes>
                <Route path='/' element={<Marketplace marketData={marketData} setMarketData={setMarketData} />} />
                {/* <Route path='/collection' element={<Collection userClaims={userClaims} collectedCards={collectedCards} setCollectedCards={setCollectedCards} />} /> */}
                <Route path='/collection' element={<InDevelopment />} />
                <Route path='/login' element={<Login setUserClaims={setUserClaims} />} />
            </Routes>
            <NavBar />
        </div>
    </>)
}

export default App
