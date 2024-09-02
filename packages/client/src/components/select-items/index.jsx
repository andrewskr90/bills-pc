import React, { useState } from 'react'
import Item from '../item/index.jsx'
import Search from '../../features/search/index.jsx'
import { searchForItems } from '../../utils/search'
import './assets/selectItem.css'
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
        setLotItemCounts({
            ...lotItemCounts,
            [item.id]: lotItemCounts[item.id] ? lotItemCounts[item.id].count ? {
                ...lotItemCounts[item.id],
                count: {
                    ...lotItemCounts[item.id].count,
                    [printing]: lotItemCounts[item.id].count[printing] ? lotItemCounts[item.id].count[printing] + 1 : 1
                }
            } : {
                ...lotItemCounts[item.id],
                count: { [printing]: 1 }
            } : {
                ...item,
                count: { [printing]: 1 },
                activePrinting: printing
            }
        })
    }
    const handleSubtractItem = (item, printing) => {
        if (lotItemCounts[item.id]) {
            if (lotItemCounts[item.id].count) {
                if (lotItemCounts[item.id].count[printing]) {
                    setLotItemCounts({ 
                        ...lotItemCounts, 
                        [item.id]: { 
                            ...lotItemCounts[item.id], 
                            count: {
                                ...lotItemCounts[item.id].count,
                                [printing]: lotItemCounts[item.id].count[printing] - 1 
                            }
                        } 
                    })
                }
            }
        } 
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
            return [
                ...prev,
                ...cur.count ? Object.keys(cur.count).reduce((prev, printingId) => {
                    if (cur.count[printingId]) {
                        const items = []
                        for (let i=0; i<cur.count[printingId]; i++) {
                            items.push({ ...cur, printing: printingId })
                        }
                        return [...prev, ...items]
                    } else {
                        return [...prev]
                    }
                }, []) : []
            ]
        }, [])
    }

    const handleFindCount = (item_id, selectedPrinting) => {
        return lotItemCounts[item_id] 
            ? lotItemCounts[item_id].count
                ? lotItemCounts[item_id].count[selectedPrinting] 
                    ? lotItemCounts[item_id].count[selectedPrinting] 
                    : undefined 
                : undefined
            : undefined
    }

    const handleChangePrinting = (item, printing) => {
        setLotItemCounts({
            ...lotItemCounts,
            [item.id]: {
                ...item,
                ...lotItemCounts[item.id],
                activePrinting: printing
            }
        })
    }
   
    const countConfig = {
        handleAddItem,
        handleSubtractItem,
        handleChangePrinting,
        handleFindCount,
    }

    return (<div className='selectItems page'>
        <Banner titleText={'Add Lot'} handleClickBackArrow={handleClickBackArrow} />
        <p>item count: {Object.keys(lotItemCounts).reduce((prev, itemId) => {
            if (lotItemCounts[itemId].count) {
                return Object.keys(lotItemCounts[itemId].count).reduce((prev, printingId) => {
                    return lotItemCounts[itemId].count[printingId] + prev
                }, 0) + prev
            }
            return prev
        }, 0)}</p>
        <p>NM value: {Object.keys(lotItemCounts).reduce((prev, itemId) => {
            if (lotItemCounts[itemId]) {
                if (lotItemCounts[itemId].count) {
                    return Object.keys(lotItemCounts[itemId].count).reduce((prev, printingId) => {
                        return (lotItemCounts[itemId].marketValue[printingId] * lotItemCounts[itemId].count[printingId]) + prev
                    }, 0) + prev
                }
            }
            return prev
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
