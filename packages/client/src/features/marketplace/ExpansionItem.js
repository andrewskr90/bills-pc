import React from 'react'
import MarketplaceChart from './MarketplaceChart'

const ExpansionItem = (props) => {
    const { item, marketData } = props
    
    return (<div className={`expansionItem ${item.percentChange > 0 ? 'up' : item.percentChange ? 'down' : ''}`}>
        <div className='image'>
            <img src={`https://product-images.tcgplayer.com/fit-in/656x656/${item.tcgplayer_product_id}.jpg`}></img>
        </div>
        <div className='chartAndValue'>
            <MarketplaceChart item={item} marketData={marketData} />
            <div className='valueAndChange'>
                <p className='marketValue'>${item.marketValue}</p>
                <p className='percentChange'>{item.percentChange > 0 ? '+' : ''}{item.percentChange.toFixed(2)}%</p>
            </div>
        </div>
    </div>)
}

export default ExpansionItem
