import React, { useEffect } from 'react'
import { generateMarketItemSortCB } from '../../utils/sort'
import { filterMarketItems } from '../../utils/filter'
import { applyMarketChanges } from '../../utils/market'
import Toolbar from '../../layouts/toolbar'
import ItemContainer from '../../components/item-container'
import Item from '../../components/item'
import BillsPcService from '../../api/bills-pc'

const ExpansionItems = (props) => {
    const { referenceData, setReferenceData, selectedSetId, handleSelectItem, countConfig } = props
    const sortKey = 'itemSort'
    const filterKey = 'market'
    const matchSetToId = (marketDataSets, targetSetId) => {
        const matchedSet = marketDataSets.filter(set => set.set_v2_id == targetSetId)[0]
        return matchedSet
    }
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
    }, [])
    return (
        <>
            <div className='title'>
                <h3>{ referenceData.sets.filter(expansion => expansion.set_v2_id === selectedSetId)[0].set_v2_name }</h3>
                <p>Market Values</p>
            </div>
            <Toolbar
                filterKey={filterKey} 
                sortKey={sortKey}
                viewRangeSelector={true}
                referenceData={referenceData}
                setReferenceData={setReferenceData}
            />
            {referenceData.sets.filter(expansion => expansion.set_v2_id === selectedSetId)[0].items.length > 0
            ?
            <ItemContainer>
                {applyMarketChanges(filterMarketItems(matchSetToId(referenceData.sets, selectedSetId).items, referenceData.filter.market))
                    .sort(generateMarketItemSortCB(referenceData, sortKey))
                    .map(item => {
                        return <Item key={item.id} referenceData={referenceData} item={item} handleSelectItem={handleSelectItem} countConfig={countConfig} />
                    })
                }
            </ItemContainer>
            :
            <div className='loadingGradient loadingExpansionItems'>Loading Expansion Items...</div>}
        </>
    )
}

export default ExpansionItems