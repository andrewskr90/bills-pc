import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import RangeSelector from '../../components/range-selector'
import { applyMarketChanges } from '../../utils/market'
import MarketplaceChart from './MarketplaceChart'
import { generateDisplayedMarketValue } from '../../utils/market'

const ExpansionItemInfo = (props) => {
    const { referenceData, setReferenceData } = props
    const [targetItem, setTargetItem] = useState()
    const [loadImage, setLoadImage] = useState(true)
    const params = useParams()
    const targetExpansionId = params['setId']
    const targetItemId = params['itemId']

    useEffect(() => {
        if (referenceData.sets.filter(expansion => expansion.set_v2_id === targetExpansionId)[0].items.length > 0) {
            const filteredTargetItem = referenceData.sets.filter(expansion => {
                return expansion.set_v2_id === targetExpansionId
            })[0].items.filter(item => {
                if (item.card_id === targetItemId || item.product_id === targetItemId) return item
            })
            setTargetItem(applyMarketChanges(filteredTargetItem)[0])
        }
    }, [referenceData])

    const handleAddToCollection = () => {

    }

    const handleImageError = () => {
        setLoadImage(false)
    }
    
    return (<div className='expansionItemInfo'>
        {targetItem
        ?
        <>
            <h3 className='name'>{targetItem.name}</h3>
            <div>
                <div className='image'>
                    {loadImage
                    ?
                    <img 
                        src={`https://product-images.tcgplayer.com/fit-in/656x656/${targetItem.tcgplayer_product_id}.jpg`} 
                        onError={handleImageError} 
                    />
                    :
                    <p className='unavailable'>Image Unavailable</p>}
                </div>
                <div className='besideImg'>
                    <RangeSelector referenceData={referenceData} setReferenceData={setReferenceData} />
                    <MarketplaceChart item={targetItem} referenceData={referenceData} />
                    <div 
                        className={`valueAndChange ${targetItem.formattedPrices.changes[referenceData.dateRange] > 0 
                            ? 'up' 
                            : targetItem.formattedPrices.changes[referenceData.dateRange] ? 'down' : ''}`
                        }
                    >
                        <p className='marketValue'>${generateDisplayedMarketValue(targetItem.marketValue)}</p>
                        <p className='percentChange'>
                            {targetItem.formattedPrices.changes[referenceData.dateRange] > 0 ? '+' : ''}
                            {targetItem.formattedPrices.changes[referenceData.dateRange].toFixed(2)}%
                        </p>
                    </div>
                    <button className='addToCollection' onClick={handleAddToCollection}>Update Collection</button>
                </div>
            </div>
        </>
        :
        <>nope</>}
    </div>)
}

export default ExpansionItemInfo
