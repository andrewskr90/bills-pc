import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import RangeSelector from '../../components/range-selector'
import { applyMarketChanges } from '../../utils/market'
import MarketplaceChart from './MarketplaceChart'
import { generateDisplayedMarketValue } from '../../utils/market'
import AffiliateLink from '../../components/affiliate-link'
import BillsPcService from '../../api/bills-pc'

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
        } else {
            (async () => {
                await BillsPcService.getMarketPrices({ set_v2_id: targetExpansionId})
                    .then(res => {
                        setReferenceData({
                            ...referenceData,
                            sets: referenceData.sets.map(expansion => {
                                if (expansion.set_v2_id === targetExpansionId) {
                                    return {
                                        ...expansion,
                                        items: res.data
                                    }
                                } else {
                                    return expansion
                                }
                            })
                        })
                    })
                    .catch(err => console.log(err))
            })()
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
            <h2 className='name'>{targetItem.name}</h2>
            <div className='imageAndData'>
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
                    {targetItem.marketValue[targetItem.printings[0]] ? <div 
                        className={`valueAndChange ${targetItem.formattedPrices[targetItem.printings[0]].changes[referenceData.dateRange] > 0 
                            ? 'up' 
                            : targetItem.formattedPrices[targetItem.printings[0]].changes[referenceData.dateRange] ? 'down' : ''}`
                        }
                    >
                        <p className='marketValue'>${generateDisplayedMarketValue(targetItem.marketValue[targetItem.printings[0]])}</p>
                        <p className='percentChange'>
                            {targetItem.formattedPrices[targetItem.printings[0]].changes[referenceData.dateRange] > 0 ? '+' : ''}
                            {targetItem.formattedPrices[targetItem.printings[0]].changes[referenceData.dateRange].toFixed(2)}%
                        </p>
                    </div> : (
                        <p>Price Not Available</p>
                    )}
                </div>
            </div>
            <div className='purchaseSection'>
                <p>Support Bill's PC!</p>
                <AffiliateLink path={`/product/${targetItem.tcgplayer_product_id}`}>
                    <button className='affiliateLinkToItem' onClick={handleAddToCollection}>Buy On TCGplayer</button>
                </AffiliateLink>
            </div>
        </>
        :
        <>Loading...</>}
    </div>)
}

export default ExpansionItemInfo
