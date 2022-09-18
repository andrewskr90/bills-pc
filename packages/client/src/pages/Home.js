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
    selected_set_id: '',
    selected_set_name: '',
    sets: [
        {
            id: '',
            name: '',
            items: [
                {
                    card_id: '',
                    name: '',
                    number: '',
                    rarity: '',
                    foil_only: '',
                    product_id: '',
                    release_date: '',
                    description: '',
                    market_prices: []
                }
            ]
            // cards: [
            //     {
            //         id: '',
            //         name: '',
            //         number: '',
            //         rarity: '',
            //         foil_only: '',
            //         market_prices: []
            //     }
            // ],
            // products: [
            //     {
            //         id: '',
            //         name: '',
            //         release_date: '',
            //         description: '',
            //         market_prices: []
            //     }
            // ]
        }
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
        BillsPcService.getSetsV2()
            .then(res => {
                setReferenceData({
                    ...referenceData,
                    sets: res.data
                })
                setMarketData({
                    ...marketData,
                    selected_set_id: res.data[105].set_v2_id,
                    selected_set_name: res.data[105].set_v2_name,
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
                            // const cardsWithPrices = []
                            // const productsWithPrices = []
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
                                // if (item.card_v2_id) {
                                //     cardsWithPrices.push({
                                //         id: item.card_v2_id,
                                //         name: item.card_v2_name,
                                //         number: '',
                                //         rarity: '',
                                //         foil_only: '',
                                //         market_prices: item.market_price_prices
                                //     })
                                // } else if (item.product_id) {
                                //     productsWithPrices.push({
                                //         id: item.product_id,
                                //         name: item.product_name,
                                //         release_date: '',
                                //         description: '',
                                //         market_prices: item.market_price_prices
                                //     })
                                // }
                            })
                            console.log(itemsWithPrices)
                            return {
                                id: set.id,
                                name: set.name,
                                items: itemsWithPrices
                                // cards: cardsWithPrices,
                                // products: productsWithPrices
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
        if (marketData.selected_set_id) {
            getSetMarketData(marketData.selected_set_id)
        }
    }, [marketData.selected_set_id])
    
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
