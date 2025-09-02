import React, { useState } from 'react'
import './assets/item.css'

const Item = (props) => {
    const { item, referenceData, handleSelectItem, countConfig, isGrid, allowSelectPrinting, allowSelectCondition } = props
    const [loadImage, setLoadImage] = useState(true)
    const [selectedPrinting, setSelectedPrinting] = useState(allowSelectPrinting ? item.printings[0].id : undefined)
    const [selectedCondition, setSelectedCondition] = useState(allowSelectCondition ? item.conditions[0].id : undefined)
    const handleImageError = () => {
        setLoadImage(false)
    }
    const handleChangePrinting = (e) => {
        setSelectedPrinting(e.target.value)
    }
    const handleChangeCondition = (e) => {
        setSelectedCondition(e.target.value)
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
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', padding: '4px' }}>
                    {allowSelectCondition && <select style={{ width: '80%' }} value={selectedCondition} onChange={handleChangeCondition}>
                        {item.conditions.map(condition => {
                            const referenceCondition = referenceData.bulk.condition.find(c => c.condition_id === condition.id)
                            const conditionName = referenceCondition ? referenceCondition.condition_name : ''
                            return <option value={condition.id}>{conditionName}</option>
                        })}
                    </select>}
                    {allowSelectPrinting && <select style={{ width: '80%' }} value={selectedPrinting} onChange={handleChangePrinting}>
                        {item.printings.map(printing => {
                            const referencePrinting = referenceData.bulk.printing.find(p => p.printing_id === printing.id)
                            const printingName = referencePrinting ? referencePrinting.printing_name : ''
                            return <option value={printing.id}>{printingName}</option>
                        })}
                    </select>}
                    {allowSelectPrinting && handleSelectItem && <MoreInfo />}
                </div>
                {countConfig !== undefined && (
                    <div className='count'>
                        <button onClick={() => countConfig.handleSubtractItem(item, selectedPrinting, selectedCondition)}>-</button>
                        <div>{countConfig.handleFindCount(item.id, selectedPrinting, selectedCondition) ? countConfig.handleFindCount(item.id, selectedPrinting, selectedCondition) : ''}</div>
                        <button onClick={() => countConfig.handleAddItem(item, selectedPrinting, selectedCondition)}>+</button>
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
