import React, { useState, useEffect } from 'react'
import Item from '../item'
import Search from '../../features/search'
import { searchForItems } from '../../utils/search'
import './assets/selectItem.less'
import { applyMarketChanges } from '../../utils/market'
import ItemContainer from '../item-container'
import Banner from '../../layouts/banner'
import Toolbar from '../../layouts/toolbar'
import { filterMarketItems } from '../../utils/filter'
import { generateMarketItemSortCB } from '../../utils/sort'
import { useNavigate } from 'react-router-dom'
import { buildPreviousRoute } from '../../utils/location'
import ExpansionsMarketplace from '../../features/marketplace/ExpansionsMarketplace'
import ExpansionItemsMarketplace from '../../features/marketplace/ExpansionItemsMarketplace'
import ExpansionItems from '../../features/marketplace/ExpansionItems'

const SelectItems = (props) => {
    const { 
        referenceData,
        setReferenceData,
        handleSelectItems,
        initialEmptyMessage,
    } = props
    const [loading, setLoading] = useState(false)
    const [searchedItems, setSearchedItems] = useState([])
    const [emptyMessage, setEmptyMessage] = useState(initialEmptyMessage)
    const [lotItemCounts, setLotItemCounts] = useState({})
    const [expansionOrSearch, setExpansionOrSearch] = useState('search')
    const [selectedExpansion, setSelectedExpansion] = useState(undefined)
    const sortKey = 'itemSort'
    const filterKey = 'market'
    const navigate = useNavigate()

    const handleAddItem = (item) => {
        const itemId = item.card_id || item.product_id
        if (lotItemCounts[itemId]) {
            if (lotItemCounts[itemId].count) setLotItemCounts({ ...lotItemCounts, [itemId]: { ...lotItemCounts[itemId], count: lotItemCounts[itemId].count +1 } })
            else setLotItemCounts({ ...lotItemCounts, [itemId]: { item, count: 1 } })
        }
        else setLotItemCounts({ ...lotItemCounts, [itemId]: { item, count: 1 } })
    }
    const handleSubtractItem = (item) => {
        const itemId = item.card_id || item.product_id
        if (lotItemCounts[itemId]) {
            if (lotItemCounts[itemId].count) setLotItemCounts({ ...lotItemCounts, [itemId]: { ...lotItemCounts[itemId], count: lotItemCounts[itemId].count - 1 } })
        } 
    }

    const submitSearch = (relayedSearch) => {
        setLoading(true)
        searchForItems(relayedSearch.category, relayedSearch.value)
            .then(res => {
                setEmptyMessage('No results found.')
                setSearchedItems(res.data)
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
                setLoading(false)
            })
    }

    const handleClickBackArrow = () => {
        navigate(buildPreviousRoute(location))
    }
    const convertToItemArray = () => {
        return Object.keys(lotItemCounts).reduce((prev, itemId) => {
            const cur = lotItemCounts[itemId]
            if (cur.count > 1) {
                const items = []
                for (let i=0; i<cur.count; i++) {
                    items.push(cur.item)
                }
                return [...prev, ...items]
            }
            return [...prev, cur.item]
        }, [])
    }

    const handleFindCount = (item_id) => {
        return lotItemCounts[item_id] ? lotItemCounts[item_id].count : undefined
    }
    const countConfig = {
        handleAddItem,
        handleSubtractItem,
        handleFindCount,
    }

    return (<div className='selectItems page'>
        <Banner titleText={'Add Lot'} handleClickBackArrow={handleClickBackArrow} />
        <p>item count: {Object.keys(lotItemCounts).reduce((prev, itemId) => lotItemCounts[itemId].count + prev, 0)}</p>
        <p>NM value: {Object.keys(lotItemCounts).reduce((prev, itemId) => (lotItemCounts[itemId].item.marketValue * lotItemCounts[itemId].count) + prev, 0)}</p>
        <button onClick={() => handleSelectItems(convertToItemArray())}> Add Lot</button>
        <div className='itemFinder'>
            <div style={{ display: 'flex' }}>
                <button onClick={() => setExpansionOrSearch('search')}>Search</button>
                <button onClick={() => setExpansionOrSearch('expansion')}>Expansion</button>
            </div>
            {expansionOrSearch === 'search' ? (
                <>
                    <Search submitSearch={submitSearch} />
                    <Toolbar 
                        viewRangeSelector={true} 
                        filterKey={filterKey}
                        referenceData={referenceData} 
                        setReferenceData={setReferenceData}
                        sortKey={sortKey}
                    />
                    <ItemContainer emptyMessage={emptyMessage} loading={loading}>
                        {applyMarketChanges(
                            filterMarketItems(searchedItems, referenceData.filter[filterKey])).sort(generateMarketItemSortCB(referenceData, sortKey)).map((item) => {
                            const item_id = item.card_id || item.product_id
                            return <Item 
                                key={item_id} 
                                item={item} 
                                referenceData={referenceData} 
                                countConfig={countConfig} 
                            />
                        })}
                    </ItemContainer>
                </>
            ) : (
                <>
                    {!selectedExpansion ? (
                        <ExpansionsMarketplace 
                            handleSelectSet={(id) => setSelectedExpansion(id)}
                            referenceData={referenceData}
                            setReferenceData={setReferenceData}
                        />
                    ) : (
                        <>
                            <button onClick={() => setSelectedExpansion(undefined)}>clear set</button>
                            <ExpansionItems 
                                selectedSetId={selectedExpansion}
                                referenceData={referenceData} 
                                setReferenceData={setReferenceData}
                                countConfig={countConfig} 

                            />
                        </>
                    )}
                </>
            )}
        </div>
    </div>)
}

export default SelectItems
