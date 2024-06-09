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
    const [selectedPrinting, setSelectedPrinting] = useState()
    const params = useParams()
    const targetExpansionId = params['setId']
    const targetItemId = params['itemId']
    
    useEffect(() => {
        if (referenceData.sets.filter(expansion => expansion.set_v2_id === targetExpansionId)[0].items.length > 0) {
            const filteredTargetItem = referenceData.sets.filter(expansion => {
                return expansion.set_v2_id === targetExpansionId
            })[0].items.filter(item => {
                if (item.id === targetItemId) return item
            })
            setTargetItem(applyMarketChanges(filteredTargetItem)[0])
            setSelectedPrinting(filteredTargetItem[0].printings[0])
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
                        src={`https://product-images.tcgplayer.com/fit-in/656x656/${targetItem.tcgpId}.jpg`} 
                        onError={handleImageError} 
                    />
                    :
                    <p className='unavailable'>Image Unavailable</p>}
                </div>
                <div className='besideImg'>
                    <RangeSelector referenceData={referenceData} setReferenceData={setReferenceData} />
                    <MarketplaceChart id={targetItem.id} prices={targetItem.formattedPrices} printing={selectedPrinting} referenceData={referenceData} />
                    {targetItem.marketValue[selectedPrinting] ? <div 
                        className={`valueAndChange ${targetItem.formattedPrices[selectedPrinting].changes[referenceData.dateRange] > 0 
                            ? 'up' 
                            : targetItem.formattedPrices[selectedPrinting].changes[referenceData.dateRange] ? 'down' : ''}`
                        }
                    >
                        <p className='marketValue'>${generateDisplayedMarketValue(targetItem.marketValue[selectedPrinting])}</p>
                        <p className='percentChange'>
                            {targetItem.formattedPrices[selectedPrinting].changes[referenceData.dateRange] > 0 ? '+' : ''}
                            {targetItem.formattedPrices[selectedPrinting].changes[referenceData.dateRange].toFixed(2)}%
                        </p>
                    </div> : (
                        <p>Price Not Available</p>
                    )}
                </div>
            </div>
            <select value={selectedPrinting} onChange={(e) => setSelectedPrinting(e.target.value)}>
                {targetItem.printings.map(printing => <option value={printing}>{referenceData.bulk.printing.find(p => p.printing_id === printing).printing_name}</option>)}
            </select>
            <div className='purchaseSection'>
                <p>Support Bill's PC!</p>
                <AffiliateLink path={`/product/${targetItem.tcgpId}`}>
                    <button className='affiliateLinkToItem' onClick={handleAddToCollection}>Buy On TCGplayer</button>
                </AffiliateLink>
            </div>
        </>
        :
        <>Loading...</>}
    </div>)
}

export default ExpansionItemInfo
