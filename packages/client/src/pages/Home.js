import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import BillsPcService from '../api/bills-pc'
import Marketplace from '../features/marketplace'
import NavBar from '../layouts/NavBar'
import Collection from '../features/collection'
import ImportPurchase from '../features/import-purchase/index.js'
import Profile from '../features/profile'

const initialReferenceDataValues = {
    sets: [],
    cards: [],
    products: []
}

const initialMarketData = {
    // initially set to -1 so change registers, triggering useEffect
    selectedSetIndex: -1,
    dateRange: '1W',
    sets: [
        // {
        //     id: '',
        //     name: '',
        //     items: [
        //         {
        //             card_id: '',
        //             name: '',
        //             number: '',
        //             rarity: '',
        //             foil_only: '',
        //             product_id: '',
        //             release_date: '',
        //             description: '',
        //             market_prices: []
        //         }
        //     ]
        //     cards: [
        //         {
        //             id: '',
        //             name: '',
        //             number: '',
        //             rarity: '',
        //             foil_only: '',
        //             market_prices: []
        //         }
        //     ],
        //     products: [
        //         {
        //             id: '',
        //             name: '',
        //             release_date: '',
        //             description: '',
        //             market_prices: []
        //         }
        //     ]
        // }
    ]
}

const Home = (props) => {
    const { userClaims } = props
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
            })
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

    const getSetMarketData = (set_id) => {
        
        BillsPcService.getMarketPrices({ set_v2_id: set_id, marketwatch: true })
            .then(res => {
                setMarketData({
                    ...marketData,
                    sets: marketData.sets.map(set => {
                        if (set.id === set_id) {
                            const itemsWithPrices = []
                            res.data.forEach(item => {
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
                            console.log(itemsWithPrices)
                            return {
                                id: set.id,
                                name: set.name,
                                items: itemsWithPrices
                            }
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

    return (<div className='home'>
        <header>
            <h1>Bill's PC</h1>
        </header>
        <Routes>
            <Route path='/' element={<Marketplace marketData={marketData} setMarketData={setMarketData} />} />
            <Route path='/collection' element={<Collection userClaims={userClaims} collectedCards={collectedCards} />} />
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
