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
        marketData,
        setMarketData,
        referenceData,
        openFilterModal,
        removeFilter,
        showFilterModal,
        setShowFilterModal
    } = props
    const selectedSetId = useParams()['setId']

    const updateSetSort = (updatedSet) => {
        setMarketData({
            ...marketData,
            sets: marketData.sets.map(set => {
                if (set.id === selectedSetId) {
                    return updatedSet
                } else {
                    return set
                }
            })
        })
    }

    useEffect(() => {
        const selectedSetMarketData = marketData.sets.filter((set) => set.id === selectedSetId)[0]
        if (selectedSetMarketData.items.length === 0) {
            BillsPcService.getMarketPrices({ set_v2_id: selectedSetId})
                .then(res => {
                    setMarketData({
                    ...marketData,
                        sets: marketData.sets.map(set => {
                            if (set.id === selectedSetId) {
                                return {
                                    ...set,
                                    items: formatSetMarketData(res.data)
                                }
                            } else {
                                return set
                            }
                        })
                    })
                })
        }
    }, [])
    
    return (<div className='expansionItemsMarketplace'>
        <div className='title'>
            <h3>{marketData.sets.filter(set => set.id === selectedSetId)[0].name}</h3>
            <p>Market Values</p>
        </div>
        <div className='toolbar'>
            <button className='addFilter' onClick={openFilterModal}>
                <p>Filter</p>
                {marketData.filters.length > 0
                ?
                <div className='filterCount'>{marketData.filters.length}</div>
                :
                <></>}
            </button>
            <Sort dataObject={marketData.sets.filter(set => set.id === selectedSetId)[0]} setDataObject={updateSetSort} />
            <RangeSelectors 
                marketData={marketData} 
                setMarketData={setMarketData} 
            />
        </div>
        <ExpansionItems marketData={marketData} />
        <FilterModal 
            marketData={marketData} 
            setMarketData={setMarketData} 
            referenceData={referenceData} 
            showFilterModal={showFilterModal} 
            setShowFilterModal={setShowFilterModal}
        />
    </div>)
}

export default ExpansionItemsMarketplace