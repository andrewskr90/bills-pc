import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ExpansionItems from './ExpansionItems'
import RangeSelectors from './RangeSelectors'
import FilterModal from './FilterModal'
import BillsPcService from '../../api/bills-pc'
import Sort from '../../components/Sort'

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
        setReferenceData,
        openFilterModal,
        showFilterModal,
        setShowFilterModal
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
        <div className='toolbar'>
            <button className='addFilter' onClick={openFilterModal}>
                <p>Filter</p>
                {referenceData.expansionItemFilters.length > 0
                ?
                <div className='filterCount'>{referenceData.expansionItemFilters.length}</div>
                :
                <></>}
            </button>
            <Sort dataObject={referenceData} setDataObject={setReferenceData} sortKey={sortKey} />
            <RangeSelectors 
                referenceData={referenceData} 
                setReferenceData={setReferenceData} 
            />
        </div>
        {referenceData.sets.filter(expansion => expansion.set_v2_id === selectedSetId)[0].items.length > 0
        ?
        <ExpansionItems referenceData={referenceData} sortKey={sortKey} />
        :
        <div className='loadingGradient loadingExpansionItems'>Loading Expansion Items...</div>}
        <FilterModal 
            referenceData={referenceData} 
            setReferenceData={setReferenceData}
            showFilterModal={showFilterModal} 
            setShowFilterModal={setShowFilterModal}
            filterKey={'expansionItemFilters'}
        />
    </div>)
}

export default ExpansionItemsMarketplace
