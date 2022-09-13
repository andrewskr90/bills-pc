import React from 'react'

const MarketplaceItem = (props) => {
    const { item } = props

    return (<div className={`marketplaceItem ${item.market_price_daily_change > 0 ? 'up' : 'down'}`}>
        <div className='image'>

        </div>
        <div className='setAndItemName'>
            <p className='setName'>{item.set_v2_name}</p>
            <p className='itemName'>{item.item_name}</p>
        </div>
        <div className='valueAndChange'>
            <p>${item.market_price_price}</p>
            <p>{item.market_price_daily_change > 0 ? '+' : ''}{item.market_price_daily_change}%</p>
        </div>
    </div>)
}

export default MarketplaceItem
