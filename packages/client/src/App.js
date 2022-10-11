import React, { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'

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
    dateRange: 'week',
    sets: [],
    filters: []
}

//calling api before app renders can lead to bugs
//render app first, call data in useEffect,
//then set initialData to true
let initialData = false

const formatSetsForMarketData = (sets) => {
    const formattedSets = sets.map(set => {
        let todayAverage
        let weekAverage
        let twoWeekAverage
        let monthAverage
        let weekChange
        let twoWeekChange
        let monthChange

        if (set.top_ten_average_today === null) {
            todayAverage = 'Unavailable'
            weekChange = 'Unavailable'
            twoWeekChange = 'Unavailable'
            monthChange = 'Unavailable'


            // START Here
                        // START Here

                                    // START Here

                                                // START Here


            
        } else {
            todayAverage = Number(set.top_ten_average_today).toFixed(2)
            if (set.top_ten_average_week === null) {
                weekAverage = 'Unavailable'
                weekChange = 'Unavailable'
            } else {
                weekAverage = Number(set.top_ten_average_week)
                weekChange = ((todayAverage - weekAverage) / weekAverage * 100).toFixed(2)
            }
            if (set.top_ten_average_two_week === null) {
                twoWeekAverage = 'Unavailable'
                twoWeekChange = 'Unavailable'
            } else {
                twoWeekAverage = Number(set.top_ten_average_two_week)
                twoWeekChange = ((todayAverage - twoWeekAverage) / twoWeekAverage * 100).toFixed(2)
            }
            if (set.top_ten_average_month === null) {
                monthAverage = 'Unavailable'
                monthChange = 'Unavailable'
            } else {
                monthAverage = Number(set.top_ten_average_month)
                monthChange = ((todayAverage - monthAverage) / monthAverage * 100).toFixed(2)
            }                
        }

        return {
            id: set.set_v2_id,
            name: set.set_v2_name,
            topTenAverage: {
                today: todayAverage,
                week: weekAverage,
                twoWeek: twoWeekAverage,
                month: monthAverage
            },
            topTenPercentChange: {
                week: weekChange,
                twoWeek: twoWeekChange,
                month: monthChange
            },
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
                sets: formatSetsForMarketData(fetchedTopTenMarket)
            })
            initialData = true
        })()
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
        // 
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
        {marketData.sets.length > 0
        ?
        <div className='app'>
            <header>
                <h1>Bill's PC</h1>
                <p>Pokemon Card Portfolio App</p>
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
