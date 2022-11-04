import React, { useEffect, useState } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'

import Login from './pages/Login'
import Marketplace from './features/marketplace'
import NavBar from './layouts/NavBar'

import BillsPcService from './api/bills-pc'
import './styles/App.less'
import InDevelopment from './pages/InDevelopment'
import { initialReferenceDataValues } from './data/initialData'

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
            setUserClaims(fetchedUserClaims)
            setReferenceData({
                ...referenceData,
                sets: formattedExpansions(fetchedExpansions),
                rarities: fetchedRarities
            })
            initialData = true
            await BillsPcService.getMarketPrices({ topTenAverage: true })
                .then(res => {
                    setTopTenLoaded(res.data)
                })
                .catch(err => {
                    console.log(err)
                })
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
            <header>
                <h1>Bill's PC</h1>
            </header>
            <Routes>
                <Route path='/market/*' 
                    element={<Marketplace 
                        referenceData={referenceData} 
                        setReferenceData={setReferenceData}
                    />} 
                />
                {/* <Route path='/collection' element={<Collection userClaims={userClaims} collectedCards={collectedCards} setCollectedCards={setCollectedCards} />} /> */}
                <Route path='/collection' element={<InDevelopment />} />
                <Route path='/login' element={<Login setUserClaims={setUserClaims} />} />
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
