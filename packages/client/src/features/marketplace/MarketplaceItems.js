import React from 'react'
import MarketplaceItem from './MarketplaceItem'
import { calcItemMarketData } from '../../utils/market'


const MarketplaceItems = (props) => {
    const { marketData } = props
    const { selectedSetIndex } = marketData
    return (<div className='marketplaceItems'>
        {marketData.sets[selectedSetIndex].items
                .filter(item => item.market_prices !== null)
                .map((item, idx) => {
                    const itemMarketData = calcItemMarketData(item.market_prices)
                    const itemValue = Number(itemMarketData.prices.latest).toFixed(2) 
                    let percentChange
                    if (marketData.dateRange === '1D') {
                        percentChange = Number(itemMarketData.changes.daily).toFixed(2)
                    } else if (marketData.dateRange === '1W') {
                        percentChange = Number(itemMarketData.changes.weekly).toFixed(2)
                    } else if (marketData.dateRange === '2W') {                    
                        percentChange = Number(itemMarketData.changes.biweekly).toFixed(2)
                    } else if (marketData.dateRange === '1M') {
                        percentChange = Number(itemMarketData.changes.monthly).toFixed(2)
                    }
                    return {
                        ...item,
                        formattedPrices: itemMarketData,
                        latestValue: itemValue,
                        percentChange: percentChange
                    }
                })
                .sort((a, b) => {
                    let aToCompare = Number(a.percentChange)
                    let bToCompare = Number(b.percentChange)
                    if (aToCompare < 0) {
                        aToCompare = aToCompare * (-1)
                    }
                    if (bToCompare < 0) {
                        bToCompare = bToCompare * (-1)
                    }
                    return bToCompare-aToCompare
                })
                .map(item => <MarketplaceItem itemValue={item.latestValue} percentChange={item.percentChange} marketData={marketData} item={item} />
                )}
    </div>)
}

export default MarketplaceItems
