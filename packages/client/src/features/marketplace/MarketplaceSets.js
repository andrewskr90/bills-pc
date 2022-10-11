import React from 'react'
import MarketplaceSet from './MarketplaceSet'
import RangeSelectors from './RangeSelectors'

const MarketplaceSets = (props) => {
    const { marketData, setMarketData } = props
    return (<div className='marketplaceSets'>
        <RangeSelectors marketData={marketData} setMarketData={setMarketData} />
        {marketData.sets.sort((a, b) => {
            return b.topTenPercentChange[marketData.dateRange] - a.topTenPercentChange[marketData.dateRange]
        }).map(marketDataSet => <MarketplaceSet marketData={marketData} marketDataSet={marketDataSet} />)}
    </div>)
}

export default MarketplaceSets
