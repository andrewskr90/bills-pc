import React from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import BillsPcService from '../../api/bills-pc'
import ExpansionsMarketplace from './ExpansionsMarketplace'
import ExpansionItemsMarketplace from './ExpansionItemsMarketplace'
import Search from '../search'
import SearchResults from './features/search-results'
import Header from '../../layouts/header'
import { Link } from 'react-router-dom'
import './assets/marketplace.less'

const Marketplace = (props) => {
    const { referenceData, setReferenceData } = props
    const navigate = useNavigate()

    const submitSearch = async (relayedValues) => {
        const { category, value } = relayedValues
        navigate(`search?category=${category}&value=${value}`)
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
                    referenceData={referenceData}
                    setReferenceData={setReferenceData}
                />}
            />
            <Route 
                path='/:setId/*' 
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
