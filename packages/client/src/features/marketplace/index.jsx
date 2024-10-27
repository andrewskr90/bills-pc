import React from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import ExpansionsMarketplace from './ExpansionsMarketplace.jsx'
import ExpansionItemsMarketplace from './ExpansionItemsMarketplace.jsx'
import Search from '../search/index.jsx'
import SearchResults from './features/search-results/index.jsx'
import Header from '../../layouts/header/index.jsx'
import { Link } from 'react-router-dom'
import './assets/marketplace.css'

const Marketplace = (props) => {
    const { referenceData, setReferenceData } = props
    const navigate = useNavigate()

    const submitSearch = async (value) => {
        navigate(`search?value=${value}`)
    }

    const handleSelectSet = (setId) => {
        navigate(`expansion/${setId}`)
    }

    return (<div className='marketplace'>
        <Header main title={'Marketplace'}>
            <Link to='/support-us'>Support Us</Link>
        </Header>
        <Search submitSearch={submitSearch}/>
        <Routes>
            <Route 
                path='/'
                element={<ExpansionsMarketplace
                    handleSelectSet={handleSelectSet}
                    referenceData={referenceData}
                    setReferenceData={setReferenceData}
                />}
            />
            <Route 
                path='/expansion/:setId/*' 
                element={<ExpansionItemsMarketplace 
                    referenceData={referenceData} 
                    setReferenceData={setReferenceData}
                />} 
            />
            <Route 
                path='/search/*'
                element={<SearchResults 
                    referenceData={referenceData}
                    setReferenceData={setReferenceData}
                />}
            />
        </Routes>
    </div>)
}

export default Marketplace
