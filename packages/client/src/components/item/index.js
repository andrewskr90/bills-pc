import React, { useState } from 'react'
import MarketplaceChart from '../../features/marketplace/MarketplaceChart'
import { generateDisplayedMarketValue } from '../../utils/market'
import './assets/item.less'

const Item = (props) => {
    const { item, referenceData, handleSelectItem } = props
    const [loadImage, setLoadImage] = useState(true)

    const handleImageError = () => {
        setLoadImage(false)
    }

    return (
        <div 
            onClick={() => handleSelectItem(item)} 
            className={`item ${item.formattedPrices.changes[referenceData.dateRange] > 0 
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
                <p className='marketValue'>${generateDisplayedMarketValue(item.marketValue)}</p>
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

export default Item
