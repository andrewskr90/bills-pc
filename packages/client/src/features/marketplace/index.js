import React from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import BillsPcService from '../../api/bills-pc'
import ExpansionsMarketplace from './ExpansionsMarketplace'
import ExpansionItemsMarketplace from './ExpansionItemsMarketplace'
import Search from '../search'
import SearchResults from './features/search-results'
import './assets/marketplace.less'

const Marketplace = (props) => {
    const { referenceData, setReferenceData } = props
    const navigate = useNavigate()

    const submitSearch = async (relayedValues) => {
        const { categoryValue, searchValue } = relayedValues
        let marketSearchResults = []
        if (categoryValue === 'All' || categoryValue === 'Cards') {
            if (searchValue === '') {
                await BillsPcService.getCardsV2WithValues()
                    .then(res => marketSearchResults = [
                        ...marketSearchResults,
                        ...res.data
                    ])
                    .catch(err => console.log(err))

            } else {
                await BillsPcService.getCardsV2WithValues({searchValue})
                        .then(res => marketSearchResults = [
                        ...marketSearchResults,
                        ...res.data
                    ])
                        .catch(err => console.log(err))
            }
        } if (categoryValue === 'All' || categoryValue === 'Products') {
            if (searchValue === '') {
                await BillsPcService.getProductsWithValues()
                    .then(res => marketSearchResults = [
                        ...marketSearchResults,
                        ...res.data
                    ])
                    .catch(err => console.log(err))

            } else {
                await BillsPcService.getProductsWithValues({searchValue})
                        .then(res => marketSearchResults = [
                        ...marketSearchResults,
                        ...res.data
                    ])
                        .catch(err => console.log(err))
            }
        }
        setReferenceData({
            ...referenceData,
            marketSearchResults: marketSearchResults
        })
        navigate('search')
    }

    return (<div className='marketplace'>
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
                path='/:setId' 
                element={<ExpansionItemsMarketplace 
                    referenceData={referenceData} 
                    setReferenceData={setReferenceData}
                />} 
            />
            <Route 
                path='/search'
                element={<SearchResults 
                    referenceData={referenceData}
                    setReferenceData={setReferenceData}
                />}
            />
        </Routes>
    </div>)
}

export default Marketplace
