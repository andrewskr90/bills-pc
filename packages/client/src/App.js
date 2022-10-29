import React, { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'

import Login from './pages/Login'
import Marketplace from './features/marketplace'
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
    sets: [],
    filters: [],
    dateRange: 'week',
    sort: {
        value: 'release_date',
        direction: 'desc',
        values: {
            name: {
                defaultDirection: 'asc',
                formatted: 'Name'
            },
            topTenAverageToday: {
                defaultDirection: 'desc',
                formatted: 'Top 10 Average'
            },
            topTenPercentChange: {
                defaultDirection: 'desc',
                formatted: 'Top 10 Change'
            },
            release_date: {
                defaultDirection: 'desc',
                formatted: 'Release Date'
            }
        }
    }
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

    useEffect(() => {
        (async () => {
            let fetchedUserClaims
            await BillsPcService.authenticateSession()
                .then(res => fetchedUserClaims)
                .catch(err => console.log(err))
            let fetchedReferenceData
            await BillsPcService.getReferenceData()
                .then(res => fetchedReferenceData = res.data)
                .catch(err => console.log(err))
            let fetchedTopTenMarket
            await BillsPcService.getMarketPrices({ topTenAverage: true })
                .then(res => fetchedTopTenMarket = res.data)
                .catch(err => console.log(err))

            setUserClaims(fetchedUserClaims)
            setReferenceData(fetchedReferenceData)
            setMarketData({
                ...marketData,
                sets: fetchedTopTenMarket.map(set => {
                    return {
                        ...set,
                        // assign expansion items sorting state
                        sort: {
                            value: 'marketValue',
                            direction: 'desc',
                            values: {
                                name: {
                                    defaultDirection: 'asc',
                                    formatted: 'Name'
                                },
                                marketValue: {
                                    defaultDirection: 'desc',
                                    formatted: 'Market Value'
                                },
                                percentChange: {
                                    defaultDirection: 'desc',
                                    formatted: 'Percent Change'}
                            }
                        }
                    }
                })
            })
            initialData = true
        })()
    }, [])

    return (<>
        {marketData.sets.length > 0
        ?
        <div className='app'>
            <header>
                <h1>Bill's PC</h1>
            </header>
            <Routes>
                <Route path='/market/*' element={<Marketplace marketData={marketData} setMarketData={setMarketData} referenceData={referenceData} />} />
                {/* <Route path='/collection' element={<Collection userClaims={userClaims} collectedCards={collectedCards} setCollectedCards={setCollectedCards} />} /> */}
                <Route path='/collection' element={<InDevelopment />} />
                <Route path='/login' element={<Login setUserClaims={setUserClaims} />} />
            </Routes>
            <NavBar />
        </div>
        :
        <div className='appLoading'>
            <h1>Bill's PC</h1>
            <p>loading set data...</p>
        </div>    
        }
    </>)
}

export default App
