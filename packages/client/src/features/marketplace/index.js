import React, { useState, useEffect } from 'react'
import MarketplaceItems from './MarketplaceItems'
import './assets/marketplace.less'
import RangeSelectors from './RangeSelectors'
import MarketplaceDashboard from './MarketplaceDashboard'


const Marketplace = (props) => {
    const { marketData, setMarketData } = props

    return (<div className='marketplace'>
        {marketData.sets.length > 0 
        ?
        <>  
            <MarketplaceDashboard />
            <RangeSelectors 
                marketData={marketData} 
                setMarketData={setMarketData} 
            />
            <MarketplaceItems marketData={marketData} />
        </>
        :
        <p>Loading...</p>}
    </div>)
}

export default Marketplace
