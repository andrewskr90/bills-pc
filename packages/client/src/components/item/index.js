import React, { useState } from 'react'
import MarketplaceChart from '../../features/marketplace/MarketplaceChart'
import { generateDisplayedMarketValue } from '../../utils/market'
import './assets/item.less'

const Item = (props) => {
    const { item, referenceData, handleSelectItem, countConfig } = props
    const [loadImage, setLoadImage] = useState(true)
    const handleImageError = () => {
        setLoadImage(false)
    }

    return (
        <div 
            onClick={handleSelectItem ? () => handleSelectItem(item) : undefined} 
            className={`item ${item.formattedPrices[item.printings[0]].changes[referenceData.dateRange] > 0 
                ? 'up' 
                : item.formattedPrices[item.printings[0]].changes[referenceData.dateRange] ? 'down' : ''}
            `
        }>
        <div className='imageChartAndValue'>
            <div className='image'>
                {loadImage 
                ?
                <img 
                    src={`https://product-images.tcgplayer.com/fit-in/656x656/${item.tcgpId}.jpg`} 
                    onError={handleImageError} 
                />
                :
                <p className='unavailable'>{item.name}</p>
                }
            </div>
            <div className='chartAndValue'>
                {item.marketValue[item.printings[0]]
                ?
                <>
                <MarketplaceChart item={item} referenceData={referenceData} />
                <div className='valueAndChange'>
                    <p className='marketValue'>${generateDisplayedMarketValue(item.marketValue[item.printings[0]])}</p>
                    <p className='percentChange'>
                        {item.formattedPrices[item.printings[0]].changes[referenceData.dateRange] > 0 ? '+' : ''}
                        {item.formattedPrices[item.printings[0]].changes[referenceData.dateRange].toFixed(2)}%
                    </p>
                </div>
                </>
                :
                <p className='unavailable'>Market Price Unavailable</p>}
            </div>
        </div>
        {countConfig !== undefined && (
            <div className='count'>
                <button onClick={() => countConfig.handleSubtractItem(item)}>-</button>
                <div>{countConfig.handleFindCount(item.id) ? countConfig.handleFindCount(item.id) : ''}</div>
                <button onClick={() => countConfig.handleAddItem(item)}>+</button>
            </div>
        )}
    </div>)
}

export default Item
