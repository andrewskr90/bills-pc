import React, { useState, useEffect } from 'react'
import MarketplaceItems from './MarketplaceItems'
import './assets/marketplace.less'
import RangeSelectors from './RangeSelectors'
import SetSelector from './SetSelector'


const Marketplace = (props) => {
    const { marketData, setMarketData } = props

    return (<div className='marketplace'>
        {marketData.sets.length > 0 
        ?
        <>  
            <SetSelector marketData={marketData} setMarketData={setMarketData} />
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
