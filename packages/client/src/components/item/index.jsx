import React, { useState } from 'react'
import './assets/item.css'

const Item = (props) => {
    const { item, referenceData, handleSelectItem, countConfig, isGrid, allowSelectPrinting } = props
    console.log(item)
    const [loadImage, setLoadImage] = useState(true)
    const [selectedPrinting, setSelectedPrinting] = useState(allowSelectPrinting ? item.printings[0].id : undefined)
    const handleImageError = () => {
        setLoadImage(false)
    }
    const handleChangePrinting = (e) => {
        setSelectedPrinting(e.target.value)
        if (countConfig) countConfig.handleChangePrinting(item, e.target.value)    
    }

    const MoreInfo = () => {
        return <button 
            className='rounded-[50%] bg-white text-blue border-blue border-2 w-10 h-10'
            onClick={() => handleSelectItem(item)}
        >i</button>
    }
    const GridVersion = () => {
        return (

            <div 

                className={`item 
                ${allowSelectPrinting && item.formattedPrices ?
                    item.formattedPrices[selectedPrinting].changes[referenceData.dateRange] > 0 
                    ? 'up' 
                    : item.formattedPrices[selectedPrinting].changes[referenceData.dateRange] ? 'down' : '' : ''}
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
                    {!allowSelectPrinting && handleSelectItem && <MoreInfo />}
                    {/* <div className='chartAndValue'>
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
                    </div> */}
                </div>
                <div style={{ width: '100%', display: 'flex', padding: '4px' }}>
                    {allowSelectPrinting && <select style={{ width: '80%' }} value={selectedPrinting} onChange={handleChangePrinting}>
                        {item.printings.map(printing => {
                            return <option value={printing.id}>{printing.name}</option>
                        })}
                    </select>}
                    {allowSelectPrinting && handleSelectItem && <MoreInfo />}
                </div>
                {countConfig !== undefined && (
                    <div className='count'>
                        <button onClick={() => countConfig.handleSubtractItem(item, selectedPrinting)}>-</button>
                        <div>{countConfig.handleFindCount(item.id, selectedPrinting) ? countConfig.handleFindCount(item.id, selectedPrinting) : ''}</div>
                        <button onClick={() => countConfig.handleAddItem(item, selectedPrinting)}>+</button>
                    </div>
                )}
            </div>
        )
    }
    const RowVersion = () => {
        return (
            <div className='item w-full max-w-none flex flex-row justify-between items-center px-2'>
                <div>
                    <p>{item.name}</p>
                    <p>{item.set.name}</p>
                </div>
                <MoreInfo />
            </div>
        )
    }
    return (
        isGrid ? (
            <GridVersion />
        ) : (
            <RowVersion />
        )
    )
}

export default Item
