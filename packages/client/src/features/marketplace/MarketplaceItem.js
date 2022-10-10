import React from 'react'
import MarketplaceChart from './MarketplaceChart'

const MarketplaceItem = (props) => {
    const { item, marketData, percentChange, itemValue } = props
    
    const itemPercentChange = Number(item.percentChange)

    return (<div className={`marketplaceItem ${itemPercentChange > 0 ? 'up' : itemPercentChange ? 'down' : ''}`}>
        <div className='image'>
            <img src={`https://product-images.tcgplayer.com/fit-in/656x656/${item.tcgplayer_product_id}.jpg`}></img>
        </div>
        <div className='chartAndValue'>
            <MarketplaceChart item={item} marketData={marketData} />
            <div className='valueAndChange'>
                <p>${itemValue}</p>
                <p>{percentChange > 0 ? '+' : ''}{percentChange}%</p>
            </div>
        </div>
    </div>)
}

export default MarketplaceItem
