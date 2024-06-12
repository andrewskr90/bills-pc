import React, { useState } from 'react'
import Item from '../item/index.jsx'
import Search from '../../features/search/index.jsx'
import { searchForItems } from '../../utils/search'
import './assets/selectItem.less'
import { applyMarketChanges } from '../../utils/market'
import ItemContainer from '../item-container/index.jsx'
import Banner from '../../layouts/banner/index.jsx'
import Toolbar from '../../layouts/toolbar/index.jsx'
import { filterMarketItems } from '../../utils/filter'
import { generateMarketItemSortCB } from '../../utils/sort'
import { useNavigate } from 'react-router-dom'
import { buildPreviousRoute } from '../../utils/location'
import ExpansionsMarketplace from '../../features/marketplace/ExpansionsMarketplace.jsx'
import ExpansionItems from '../../features/marketplace/ExpansionItems.jsx'

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

    const handleAddItem = (item, printing) => {
        if (lotItemCounts[item.id]) {
            if (lotItemCounts[item.id].count) setLotItemCounts({ ...lotItemCounts, [item.id]: { ...lotItemCounts[item.id], count: lotItemCounts[item.id].count +1, printing } })
            else setLotItemCounts({ ...lotItemCounts, [item.id]: { ...item, count: 1, printing } })
        }
        else setLotItemCounts({ ...lotItemCounts, [item.id]: { ...item, count: 1, printing } })
    }
    const handleSubtractItem = (item, printing) => {
        if (lotItemCounts[item.id]) {
            if (lotItemCounts[item.id].count) setLotItemCounts({ ...lotItemCounts, [item.id]: { ...lotItemCounts[item.id], count: lotItemCounts[item.id].count - 1, printing } })
        } 
    }

    const handleChangePrinting = (item, printing) => {
        if (lotItemCounts[item.id]) setLotItemCounts({ ...lotItemCounts, [item.id]: { ...lotItemCounts[item.id], printing }})
    }

    const submitSearch = (relayedSearch) => {
        setLoading(true)
        searchForItems(relayedSearch)
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
            if (cur.count === 0) return [...prev]
            if (cur.count > 1) {
                const items = []
                for (let i=0; i<cur.count; i++) {
                    items.push(cur)
                }
                return [...prev, ...items]
            }
            return [...prev, cur]
        }, [])
    }

    const handleFindCount = (item_id) => {
        return lotItemCounts[item_id] ? lotItemCounts[item_id].count : undefined
    }
    const handleFindPrinting = (item_id) => {
        return lotItemCounts[item_id] ? lotItemCounts[item_id].printing : undefined
    }
    const countConfig = {
        handleAddItem,
        handleSubtractItem,
        handleChangePrinting,
        handleFindCount,
        handleFindPrinting
    }

    return (<div className='selectItems page'>
        <Banner titleText={'Add Lot'} handleClickBackArrow={handleClickBackArrow} />
        <p>item count: {Object.keys(lotItemCounts).reduce((prev, itemId) => lotItemCounts[itemId].count + prev, 0)}</p>
        <p>NM value: {Object.keys(lotItemCounts).reduce((prev, itemId) => {
            return (lotItemCounts[itemId].marketValue[lotItemCounts[itemId].printing] * lotItemCounts[itemId].count) + prev
            }, 0)}
        </p>
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
                            filterMarketItems(searchedItems, referenceData.filter[filterKey]))
                                .sort(generateMarketItemSortCB(referenceData, sortKey))
                                .map(item => {
                                    return <Item 
                                        key={item.id} 
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
