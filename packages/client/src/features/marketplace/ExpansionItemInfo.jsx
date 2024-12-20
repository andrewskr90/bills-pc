import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import RangeSelector from '../../components/range-selector/index.jsx'
import { applyMarketChanges } from '../../utils/market'
import MarketplaceChart from './MarketplaceChart.jsx'
import { generateDisplayedMarketValue } from '../../utils/market'
import AffiliateLink from '../../components/affiliate-link/index.jsx'
import BillsPcService from '../../api/bills-pc'

const ExpansionItemInfo = (props) => {
    const { referenceData, setReferenceData } = props
    const [targetItem, setTargetItem] = useState()
    const [loadImage, setLoadImage] = useState(true)
    const [selectedPrinting, setSelectedPrinting] = useState()
    const params = useParams()
    const targetItemId = params['itemId']
    useEffect(() => {
        (async () => {
            try {
                const targetItemRes = await BillsPcService.getMarketPricesByItemId(targetItemId)
                setTargetItem(applyMarketChanges(targetItemRes.data.items)[0])
                setSelectedPrinting(targetItemRes.data.items[0].printings[0].id)
            } catch (err) {
                console.log(err)
            }
        })()
    }, [])

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
                {targetItem.printings.map(printing => <option value={printing.id}>{printing.name}</option>)}
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
