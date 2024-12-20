import React, { useEffect, useState } from 'react'
import { Routes, Route, useNavigate, useLocation, useParams, Link } from 'react-router-dom'
import InDevelopment from './pages/InDevelopment.jsx'
import Login from './pages/Login.jsx'
import Marketplace from './features/marketplace/index.jsx'
import NavBar from './layouts/NavBar.jsx'
import BillsPcService from './api/bills-pc'
import { initialReferenceDataValues } from './data/initialData'
import './index.css'
import SupportUs from './pages/SupportUs.jsx'
import Collection from './features/collection/index.jsx'
import GymLeader from './pages/gym-leader/index.jsx'
import GymLeaderOnly from './utils/auth/GymLeaderOnly.jsx'

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

    useEffect(() => {
        (async () => {
            let fetchedUserClaims
            await BillsPcService.authenticateSession()
                .then(res => fetchedUserClaims = res.data)
                .catch(err => console.log(err))
            let fetchedRarities
            await BillsPcService.getReferenceData()
                .then(res => fetchedRarities = res.data.rarities)
                .catch(err => console.log(err))
            const raritiesResponse = await BillsPcService.getRarities()
            const typesResponse = await BillsPcService.getTypes()
            const printingsResponse = await BillsPcService.getPrintings()
            const expansionsResponse = await BillsPcService.getSetsV2({ params: {} })
            const conditionsResponse = await BillsPcService.getConditions()
            setUserClaims(fetchedUserClaims)
            setReferenceData({
                ...referenceData,
                sets: formattedExpansions(expansionsResponse.data.expansions),
                rarities: fetchedRarities,
                bulk: {
                    rarity: raritiesResponse.data,
                    type: typesResponse.data,
                    printing: printingsResponse.data,
                    set: expansionsResponse.data.expansions,
                    condition: conditionsResponse.data
                },
                filter: {
                    market: calcFilterMarketItemsConfig(fetchedRarities),
                }
            })
            initialData = true
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
    
        return (<div className="h-screen">
            {initialData
            ?
            <div className='flex flex-col items-center relative px-1 h-full sm:p-0 sm:w-3/6 sm:m-auto'>
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
            <div className='appLoading h-full flex flex-col justify-center items-center'>
                <h1 className='text-xl text-blue'>Bill's PC</h1>
                <div className='loadingGradient w-3/5 h-5'>Loading...</div>
            </div>    
            }
        </div>)
}

export default App
