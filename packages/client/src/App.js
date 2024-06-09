import React, { useEffect, useState } from 'react'
import { Routes, Route, useNavigate, useLocation, useParams, Link } from 'react-router-dom'
import InDevelopment from './pages/InDevelopment'
import Login from './pages/Login'
import Marketplace from './features/marketplace'
import NavBar from './layouts/NavBar'
import BillsPcService from './api/bills-pc'
import { initialReferenceDataValues } from './data/initialData'
import './styles/App.less'
import RegisterForm from './features/authenticate/RegisterForm'
import SupportUs from '../src/pages/SupportUs'
import Collection from './features/collection'
import GymLeader from './pages/gym-leader'
import GymLeaderOnly from './utils/auth/GymLeaderOnly'

let initialData = false

const App = () => {
    const [userClaims, setUserClaims] = useState(false)
    const navigate = useNavigate()
    const [collectedCards, setCollectedCards] = useState([])
    const [referenceData, setReferenceData] = useState(initialReferenceDataValues)
    const [topTenLoaded, setTopTenLoaded] = useState([])

    const location = useLocation()

    const formattedExpansions = (expansions) => {
        return expansions.map(expansion => {
            return {
                ...expansion,
                items: []
            }
        })
    }

    const updateReferenceDataWithTopTen = (expansionsTopTenData, referenceDataSets) => {
        const fetchedTopTenLib = {}
        expansionsTopTenData.forEach((expansion, idx) => {
            fetchedTopTenLib[expansion.id] = idx
        })
        const updatedReferenceData = referenceDataSets.map(expansion => {
            return {
                ...expansion,
                topTenAverage: expansionsTopTenData[fetchedTopTenLib[expansion.set_v2_id]].topTenAverage
            }
        })
        return updatedReferenceData
    }

    const calcFilterMarketItemsConfig = (rarities) => {
        const filterMarketItemsConfig = {
            itemType: {
                card: false,
                product: false
            },
            cardRarity: {}
        }
        rarities.forEach(rarity => {
            filterMarketItemsConfig.cardRarity[rarity] = false
        })
        return filterMarketItemsConfig
    }

    const calcFilterMarketExpansionsConfig = (expansions) => {
        const expansionSeries = {}
        expansions.forEach(expansion => {
            if (expansion.set_v2_series) {
                if (!expansionSeries[expansion.set_v2_series]) {
                    expansionSeries[expansion.set_v2_series] = false
                }
            }
        })
        return {
            expansionSeries: expansionSeries
        }
    }

    useEffect(() => {
        (async () => {
            let fetchedUserClaims
            await BillsPcService.authenticateSession()
                .then(res => fetchedUserClaims = res.data)
                .catch(err => console.log(err))
            let fetchedExpansions
            await BillsPcService.getSetsV2()
                .then(res => fetchedExpansions = res.data)
                .catch(err => console.log(err))
            let fetchedRarities
            await BillsPcService.getReferenceData()
                .then(res => fetchedRarities = res.data.rarities)
                .catch(err => console.log(err))
            const raritiesResponse = await BillsPcService.getRarities()
            const typesResponse = await BillsPcService.getTypes()
            const printingsResponse = await BillsPcService.getPrintings()
            const expansionsResponse = await BillsPcService.getSetsV2()
            const conditionsResponse = await BillsPcService.getConditions()
            setUserClaims(fetchedUserClaims)
            setReferenceData({
                ...referenceData,
                sets: formattedExpansions(fetchedExpansions),
                rarities: fetchedRarities,
                bulk: {
                    rarity: raritiesResponse.data,
                    type: typesResponse.data,
                    printing: printingsResponse.data,
                    set: expansionsResponse.data,
                    condition: conditionsResponse.data
                },
                filter: {
                    market: calcFilterMarketItemsConfig(fetchedRarities),
                    expansion: calcFilterMarketExpansionsConfig(fetchedExpansions)
                }
            })
            initialData = true
            // await BillsPcService.getMarketPrices({ topTenAverage: true })
            //     .then(res => {
            //         setTopTenLoaded(res.data)
            //     })
            //     .catch(err => {
            //         console.log(err)
            //     })
        })()
        if (location.pathname === '/') {
            navigate('market')
        }
    }, [])

    useEffect(() => {
        if (topTenLoaded.length > 0) {
            setReferenceData({
                ...referenceData,
                topTenCalled: true,
                sets: updateReferenceDataWithTopTen(topTenLoaded, referenceData.sets)
            })
        }
    }, [topTenLoaded])
    
        return (<>
            {initialData
            ?
            <div className='app'>
                <Routes>
                    {/* <Route path='/register' 
                        element={<RegisterForm />}
                    /> */}
                    <Route path='/market/*' 
                        element={<Marketplace 
                            referenceData={referenceData} 
                            setReferenceData={setReferenceData}
                        />} 
                    />
                    <Route 
                        path='/collection/*'
                        element={<InDevelopment />}  
                    />
                    <Route 
                        path='/gym-leader/collection/*' 
                        element={<GymLeaderOnly
                            userClaims={userClaims}
                            setUserClaims={setUserClaims}
                        >
                            <Collection 
                                userClaims={userClaims} 
                                setUserClaims={setUserClaims}
                                collectedCards={collectedCards} 
                                setCollectedCards={setCollectedCards} 
                                referenceData={referenceData}
                                setReferenceData={setReferenceData}
                            />
                    </GymLeaderOnly>} />
                    <Route 
                        path='/gym-leader/*' 
                        element={<GymLeaderOnly
                            userClaims={userClaims}
                            setUserClaims={setUserClaims}
                        >
                            <GymLeader />
                        </GymLeaderOnly>}
                    />
                    <Route path='/login' element={<Login setUserClaims={setUserClaims} />} />
                    <Route path='/support-us' element={<SupportUs />} />
                </Routes>
                <NavBar />
            </div>
            :
            <div className='appLoading'>
                <h1>Bill's PC</h1>
                <div className='loadingGradient'>Loading...</div>
            </div>    
            }
        </>)
}

export default App
