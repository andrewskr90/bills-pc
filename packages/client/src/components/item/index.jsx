import React, { useState } from 'react'
import MarketplaceChart from '../../features/marketplace/MarketplaceChart.jsx'
import { generateDisplayedMarketValue } from '../../utils/market'
import './assets/item.less'

const Item = (props) => {
    const { item, referenceData, handleSelectItem, countConfig } = props
    const [loadImage, setLoadImage] = useState(true)
    const [selectedPrinting, setSelectedPrinting] = useState(item.printings[0])
    const handleImageError = () => {
        setLoadImage(false)
    }
    const handleChangePrinting = (e) => {
        setSelectedPrinting(e.target.value)
        if (countConfig) countConfig.handleChangePrinting(item, e.target.value)    
    }
    return (
        <div 
            className={`item ${item.formattedPrices[selectedPrinting].changes[referenceData.dateRange] > 0 
                ? 'up' 
                : item.formattedPrices[selectedPrinting].changes[referenceData.dateRange] ? 'down' : ''}
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
                {item.marketValue[selectedPrinting]
                ?
                <>
                <MarketplaceChart id={item.id} prices={item.formattedPrices} printing={selectedPrinting} referenceData={referenceData} />
                <div className='valueAndChange'>
                    <p className='marketValue'>${generateDisplayedMarketValue(item.marketValue[selectedPrinting])}</p>
                    <p className='percentChange'>
                        {item.formattedPrices[selectedPrinting].changes[referenceData.dateRange] > 0 ? '+' : ''}
                        {item.formattedPrices[selectedPrinting].changes[referenceData.dateRange].toFixed(2)}%
                    </p>
                </div>
                </>
                :
                <p className='unavailable'>Market Price Unavailable</p>}
            </div>
        </div>
        <div style={{ width: '100%', display: 'flex', padding: '4px' }}>
            <select style={{ width: '80%' }} value={selectedPrinting} onChange={handleChangePrinting}>
                {item.printings.map(printing => <option value={printing}>{referenceData.bulk.printing.find(p => p.printing_id === printing).printing_name}</option>)}
            </select>
            {handleSelectItem && <button style={{ borderRadius: '50%', backgroundColor: 'white', color: '#6065cb', borderColor: '#6065cb' }} onClick={() => handleSelectItem(item)}>i</button>}
        </div>
        {countConfig !== undefined && (
            <div className='count'>
                <button onClick={() => countConfig.handleSubtractItem(item, selectedPrinting)}>-</button>
                <div>{countConfig.handleFindCount(item.id) ? countConfig.handleFindCount(item.id) : ''}</div>
                <button onClick={() => countConfig.handleAddItem(item, selectedPrinting)}>+</button>
            </div>
        )}
    </div>)
}

export default Item
