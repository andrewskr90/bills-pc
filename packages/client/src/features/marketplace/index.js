import React, { useState, useEffect } from 'react'
import MarketplaceItems from './MarketplaceItems'
import './assets/marketplace.less'
import RangeSelectors from './RangeSelectors'
import SetSelector from './SetSelector'
import SetFilters from './SetFilters'
import SetFilter from './SetFilter'
import FilterModal from './FilterModal'

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
        {marketData.sets.length > 0 
        ?        
        <>  
            <div className='selectorAndFilter'>
                <SetSelector marketData={marketData} setMarketData={setMarketData} />
                <SetFilters 
                    marketData={marketData} 
                    setMarketData={setMarketData} 
                    openFilterModal={openFilterModal}
                />
            </div>
            <div className='filterBubbles'>
                {marketData.filters.map((filter, idx) => {
                    return <SetFilter key={idx} filter={filter} removeFilter={removeFilter} />
                })}
            </div>
            <RangeSelectors 
                marketData={marketData} 
                setMarketData={setMarketData} 
            />
            <MarketplaceItems marketData={marketData} />
            <FilterModal 
                marketData={marketData} 
                setMarketData={setMarketData} 
                referenceData={referenceData} 
                showFilterModal={showFilterModal} 
                setShowFilterModal={setShowFilterModal}
            />
        </>
        :
        <p>Loading...</p>}
    </div>)
}

export default Marketplace
