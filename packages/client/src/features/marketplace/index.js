import React, { useState, useEffect } from 'react'
import MarketplaceItems from './MarketplaceItems'
import './assets/marketplace.less'
import RangeSelectors from './RangeSelectors'
import SetSelector from './SetSelector'
import SetFilters from './SetFilters'
import FilterModal from './FilterModal'

const Marketplace = (props) => {
    const { marketData, setMarketData, referenceData } = props
    const [showFilterModal, setShowFilterModal] = useState(false)

    const openFilterModal = () => {
        setShowFilterModal(true)
    }

    return (<div className='marketplace'>
        {marketData.sets.length > 0 
        ?        
        <>  
            <SetSelector marketData={marketData} setMarketData={setMarketData} />
            <SetFilters 
                marketData={marketData} 
                setMarketData={setMarketData} 
                openFilterModal={openFilterModal}
            />
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
