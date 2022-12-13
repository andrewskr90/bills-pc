import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MarketplaceChart from './MarketplaceChart'
import { generateDisplayedMarketValue } from '../../utils/market'

const ExpansionItem = (props) => {
    const { item, referenceData } = props
    const [loadImage, setLoadImage] = useState(true)
    const navigate = useNavigate()
    
    

    const handleSelectItem = (item) => {
        const expansionId = item.set.id
        const itemId = item.card_id || item.product_id
        navigate(`/market/${expansionId}/${itemId}`)
    }

    const handleImageError = () => {
        setLoadImage(false)
    }

    return (
        <div 
            onClick={() => handleSelectItem(item)} 
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

export default ExpansionItem
