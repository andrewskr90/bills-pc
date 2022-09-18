import React from 'react'

const MarketplaceItem = (props) => {
    const { item, selectedSet } = props
    
    console.log(item)
    return (<div className={`marketplaceItem ${item.card_id ? 'up' : 'down'}`}>
        <div className='image'>

        </div>
        <div className='setAndItemName'>
            <p className='setName'>{selectedSet.name}</p>
            <p className='itemName'>{item.name}</p>
        </div>
        <div className='valueAndChange'>
            <p>${item.market_price_price}</p>
            <p>{item.market_price_daily_change > 0 ? '+' : ''}{item.market_price_daily_change}%</p>
        </div>
    </div>)
}

export default MarketplaceItem
