import React from 'react'
import MarketplaceChart from './MarketplaceChart'

const ExpansionItem = (props) => {
    const { item, referenceData } = props
    let displayedMarketvalue = item.marketValue
    if (displayedMarketvalue > 100) {
        displayedMarketvalue = Math.round(displayedMarketvalue)
    }
    
    return (<div className={`expansionItem ${item.formattedPrices.changes[referenceData.dateRange] > 0 ? 'up' : item.formattedPrices.changes[referenceData.dateRange] ? 'down' : ''}`}>
        <div className='image'>
            <img src={`https://product-images.tcgplayer.com/fit-in/656x656/${item.tcgplayer_product_id}.jpg`}></img>
        </div>
        <div className='chartAndValue'>
            <MarketplaceChart item={item} referenceData={referenceData} />
            <div className='valueAndChange'>
                <p className='marketValue'>${displayedMarketvalue}</p>
                <p className='percentChange'>{item.formattedPrices.changes[referenceData.dateRange] > 0 ? '+' : ''}{item.formattedPrices.changes[referenceData.dateRange].toFixed(2)}%</p>
            </div>
        </div>
    </div>)
}

export default ExpansionItem
