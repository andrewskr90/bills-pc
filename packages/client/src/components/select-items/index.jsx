import React, { useState } from 'react'
import './assets/selectItem.css'
import Banner from '../../layouts/banner/index.jsx'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { buildPreviousRoute } from '../../utils/location'
import AddItemSearch from './AddItemSearch.jsx'
import AddItemExpansion from './AddItemExpansion.jsx'

const SelectItems = (props) => {
    const { 
        referenceData,
        setReferenceData,
        handleSelectItems,
        initialEmptyMessage,
        actionTitle
    } = props
    const [lotItemCounts, setLotItemCounts] = useState({})
    const navigate = useNavigate()
    const location = useLocation()

    const handleAddItem = (item, printingId) => {
        setLotItemCounts({
            ...lotItemCounts,
            [item.id]: lotItemCounts[item.id] ? lotItemCounts[item.id].count ? {
                ...lotItemCounts[item.id],
                count: {
                    ...lotItemCounts[item.id].count,
                    [printingId]: lotItemCounts[item.id].count[printingId] ? lotItemCounts[item.id].count[printingId] + 1 : 1
                }
            } : {
                ...lotItemCounts[item.id],
                count: { [printingId]: 1 }
            } : {
                ...item,
                count: { [printingId]: 1 },
                activePrinting: printingId
            }
        })
    }
    const handleSubtractItem = (item, printingId) => {
        if (lotItemCounts[item.id]) {
            if (lotItemCounts[item.id].count) {
                if (lotItemCounts[item.id].count[printingId]) {
                    setLotItemCounts({ 
                        ...lotItemCounts, 
                        [item.id]: { 
                            ...lotItemCounts[item.id], 
                            count: {
                                ...lotItemCounts[item.id].count,
                                [printingId]: lotItemCounts[item.id].count[printingId] - 1 
                            }
                        } 
                    })
                }
            }
        } 
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

    const handleFindCount = (item_id, selectedPrintingId) => {
        return lotItemCounts[item_id] 
            ? lotItemCounts[item_id].count
                ? lotItemCounts[item_id].count[selectedPrintingId] 
                    ? lotItemCounts[item_id].count[selectedPrintingId] 
                    : undefined 
                : undefined
            : undefined
    }

    const handleChangePrinting = (item, printingId) => {
        setLotItemCounts({
            ...lotItemCounts,
            [item.id]: {
                ...item,
                ...lotItemCounts[item.id],
                activePrinting: printingId
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
        <Banner titleText={actionTitle} handleClickBackArrow={handleClickBackArrow} />
        <p>item count: {Object.keys(lotItemCounts).reduce((prev, itemId) => {
            if (lotItemCounts[itemId].count) {
                return Object.keys(lotItemCounts[itemId].count).reduce((prev, printingId) => {
                    return lotItemCounts[itemId].count[printingId] + prev
                }, 0) + prev
            }
            return prev
        }, 0)}</p>
        <button onClick={() => handleSelectItems(convertToItemArray())}>{actionTitle}</button>
        <div className='itemFinder'>
            <div style={{ display: 'flex' }}>
                <button onClick={() => navigate('search')}>Search</button>
                <button onClick={() => navigate('expansion')}>Expansion</button>
            </div>
            <Routes>
                <Route path='/search' element={<AddItemSearch 
                    initialEmptyMessage={initialEmptyMessage} 
                    referenceData={referenceData}
                    setReferenceData={setReferenceData}
                    countConfig={countConfig}
                />} />
                <Route path='/expansion' element={<AddItemExpansion 
                    referenceData={referenceData}
                    setReferenceData={setReferenceData}
                    countConfig={countConfig}
                />} />
            </Routes>
        </div>
    </div>)
}

export default SelectItems
