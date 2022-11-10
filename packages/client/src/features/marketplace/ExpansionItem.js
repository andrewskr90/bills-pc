import React, { useState } from 'react'
import MarketplaceChart from './MarketplaceChart'
import { useNavigate } from 'react-router-dom'

const ExpansionItem = (props) => {
    const { item, referenceData } = props
    const [loadImage, setLoadImage] = useState(true)
    const navigate = useNavigate()
    let displayedMarketvalue = item.marketValue
    if (displayedMarketvalue > 100) {
        displayedMarketvalue = Math.round(displayedMarketvalue)
    }

    const handleImageError = () => {
        setLoadImage(false)
    }

    return (
        <div 
            onClick={() => navigate(`/market/${item.set.id}`)} 
            className={`expansionItem ${item.formattedPrices.changes[referenceData.dateRange] > 0 
                ? 'up' 
                : item.formattedPrices.changes[referenceData.dateRange] ? 'down' : ''}`
        }>
        <div className='image'>
            {loadImage 
            ?
            <img 
                src={`https://product-images.tcgplayer.com/fit-in/656x656/${item.tcgplayer_product_id}.jpg`} 
                onError={handleImageError} 
            />
            :
            <p className='unavailable'>{item.name}</p>
            }
        </div>
        <div className='chartAndValue'>
            {item.marketValue
            ?
            <>
            <MarketplaceChart item={item} referenceData={referenceData} />
            <div className='valueAndChange'>
                <p className='marketValue'>${displayedMarketvalue}</p>
                <p className='percentChange'>
                    {item.formattedPrices.changes[referenceData.dateRange] > 0 ? '+' : ''}
                    {item.formattedPrices.changes[referenceData.dateRange].toFixed(2)}%
                </p>
            </div>
            </>
            :
            <p className='unavailable'>Market Price Unavailable</p>}
        </div>
    </div>)
}

export default ExpansionItem
