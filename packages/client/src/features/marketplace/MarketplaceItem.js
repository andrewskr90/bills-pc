import React from 'react'
import { calcItemMarketData } from '../../utils/market'

const MarketplaceItem = (props) => {
    const { item, marketData, percentChange, itemValue } = props
    
    return (<div className={`marketplaceItem ${Number(item.percentChange) > 0 ? 'up' : Number(item.percentChange) ? 'down' : ''}`}>
        <div className='image'>
            {item.market_prices !== null ? <p>{}</p> : <p>unavailable</p>}
        </div>
        <div className='setAndItemName'>
            <p className='setName'>{marketData.sets[marketData.selectedSetIndex].name}</p>
            <p className='itemName'>{item.name}</p>
        </div>
        <div className='valueAndChange'>
            <p>${itemValue}</p>
            <p>{percentChange > 0 ? '+' : ''}{percentChange}%</p>
        </div>
    </div>)
}

export default MarketplaceItem
