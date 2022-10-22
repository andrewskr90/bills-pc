import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import ExpansionsMarketplace from './ExpansionsMarketplace'
import ExpansionItemsMarketplace from './ExpansionItemsMarketplace'
import './assets/marketplace.less'

const Marketplace = (props) => {
    const { marketData, setMarketData, referenceData } = props
    const [showFilterModal, setShowFilterModal] = useState(false)

    const openFilterModal = () => {
        setShowFilterModal(true)
    }

    const removeFilter = (filterToRemove) => {
        const updatedFilters = marketData.filters.filter(filterToCompare => {
            let keyToCompare = Object.keys(filterToCompare)[0]
            let valueToCompare = filterToCompare[keyToCompare]
            let keyToRemove = Object.keys(filterToRemove)[0]
            let valueToRemove = filterToRemove[keyToRemove]
            if (keyToCompare !== keyToRemove) {
                return filterToCompare
            } else {
                if (valueToCompare !== valueToRemove) {
                    return filterToCompare
                }
            }
        })
        setMarketData({
            ...marketData,
            filters: updatedFilters
        })
    }

    return (<div className='marketplace'>
        <Routes>
            <Route 
                path='/'
                element={<ExpansionsMarketplace
                    marketData={marketData}
                    setMarketData={setMarketData}
                />}
            />
            <Route 
                path='/:setId' 
                element={<ExpansionItemsMarketplace 
                    marketData={marketData} 
                    setMarketData={setMarketData} 
                    referenceData={referenceData} 
                    openFilterModal={openFilterModal} 
                    removeFilter={removeFilter} 
                    showFilterModal={showFilterModal} 
                    setShowFilterModal={setShowFilterModal} 
                />} 
            />
        </Routes>
    </div>)
}

export default Marketplace
