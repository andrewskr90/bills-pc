import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ExpansionItems from './ExpansionItems'
import BillsPcService from '../../api/bills-pc'
import Toolbar from '../../layouts/toolbar'

const formatSetMarketData = (marketPrices) => {
    const formattedSetMarketData = marketPrices.map(item => {
        return {
            card_id: item.card_v2_id,
            name: item.card_v2_name || item.product_name,
            number: item.card_v2_number,
            rarity: item.card_v2_rarity,
            foil_only: item.card_v2_foil_only,
            product_id: item.product_id,
            release_date: item.product_release_date,
            description: item.product_description,
            market_prices: item.market_price_prices,
            tcgplayer_product_id: item.tcgplayer_product_id
        }
    })
    return formattedSetMarketData
}

const ExpansionItemsMarketplace = (props) => {
    const {
        referenceData,
        setReferenceData
    } = props

    const selectedSetId = useParams()['setId']
    const sortKey = 'itemSort'

    useEffect(() => {
        if (referenceData.sets.filter(expansion => expansion.set_v2_id === selectedSetId)[0].items.length === 0) {
            (async () => {
                await BillsPcService.getMarketPrices({ set_v2_id: selectedSetId})
                    .then(res => {
                        setReferenceData({
                            ...referenceData,
                            sets: referenceData.sets.map(expansion => {
                                if (expansion.set_v2_id === selectedSetId) {
                                    return {
                                        ...expansion,
                                        items: formatSetMarketData(res.data)
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
    }, [])

    return (<div className='expansionItemsMarketplace'>
        <div className='title'>
            <h3>{ referenceData.sets.filter(expansion => expansion.set_v2_id === selectedSetId)[0].set_v2_name }</h3>
            <p>Market Values</p>
        </div>
        <Toolbar 
            viewFilter={true} 
            viewSort={true}
            viewRangeSelector={true}
            filterKey={'expansionItemFilters'}
            referenceData={referenceData}
            setReferenceData={setReferenceData}
            dataObject={referenceData}
            setDataObject={setReferenceData}
            sortKey={sortKey}
        />
        {referenceData.sets.filter(expansion => expansion.set_v2_id === selectedSetId)[0].items.length > 0
        ?
        <ExpansionItems referenceData={referenceData} sortKey={sortKey} />
        :
        <div className='loadingGradient loadingExpansionItems'>Loading Expansion Items...</div>}
    </div>)
}

export default ExpansionItemsMarketplace
