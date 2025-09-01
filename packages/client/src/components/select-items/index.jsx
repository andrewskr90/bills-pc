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
        actionTitle,
        importTime,
        setImportTime
    } = props
    const [lotItemCounts, setLotItemCounts] = useState({})
    const navigate = useNavigate()
    const location = useLocation()

    const handleAddItem = (item, printingId, conditionId) => {
        if (!lotItemCounts[item.id]) {
            setLotItemCounts({ 
                ...lotItemCounts, 
                [item.id]: { 
                    ...item, 
                    count: { [printingId]: { [conditionId]: 1 } } 
                } 
            })
        } else if (!lotItemCounts[item.id].count[printingId]) {
            setLotItemCounts({ 
                ...lotItemCounts, 
                [item.id]: { 
                    ...lotItemCounts[item.id], 
                    count: { 
                        ...lotItemCounts[item.id].count,
                        [printingId]: { [conditionId]: 1 } 
                    } 
                } 
            })
        } else if (!lotItemCounts[item.id].count[printingId][conditionId]) {
            setLotItemCounts({ 
                ...lotItemCounts, 
                [item.id]: { 
                    ...lotItemCounts[item.id], 
                    count: { 
                        ...lotItemCounts[item.id].count,
                        [printingId]: { 
                            ...lotItemCounts[item.id].count[printingId],
                            [conditionId]: 1 
                        } 
                    } 
                } 
            })
        } else {
            setLotItemCounts({ 
                ...lotItemCounts, 
                [item.id]: { 
                    ...lotItemCounts[item.id], 
                    count: { 
                        ...lotItemCounts[item.id].count,
                        [printingId]: { 
                            ...lotItemCounts[item.id].count[printingId],
                            [conditionId]: lotItemCounts[item.id].count[printingId][conditionId] + 1
                        } 
                    } 
                } 
            })
        }
    }
    const handleSubtractItem = (item, printingId, conditionId) => {
        if (lotItemCounts[item.id]) {
            if (lotItemCounts[item.id].count) {
                if (lotItemCounts[item.id].count[printingId]) {
                    if (lotItemCounts[item.id].count[printingId][conditionId]) {
                        setLotItemCounts({ 
                            ...lotItemCounts, 
                            [item.id]: { 
                                ...lotItemCounts[item.id], 
                                count: {
                                    ...lotItemCounts[item.id].count,
                                    [printingId]: {
                                        ...lotItemCounts[item.id].count[printingId],
                                        [conditionId]: lotItemCounts[item.id].count[printingId][conditionId] - 1 
                                    }
                                }
                            } 
                        })
                    }
                }
            }
        } 
    }

    const handleClickBackArrow = () => {
        navigate(buildPreviousRoute(location))
    }
    const convertToItemArray = () => {
        const items = Object.keys(lotItemCounts).reduce((prev, itemId) => {
            const cur = lotItemCounts[itemId]
            if (cur.count) {
                const eachPrintingOfItem = Object.keys(cur.count).reduce((prev, printingId) => {
                    const eachConditionOfPrinting = Object.keys(cur.count[printingId]).reduce((prev, conditionId) => {
                        if (cur.count[printingId][conditionId]) {
                            const eachDuplicateOfPrintingAndCondition = []
                            for (let i=0; i<cur.count[printingId][conditionId]; i++) {
                                eachDuplicateOfPrintingAndCondition.push({ ...cur, printingId, conditionId })
                            }
                            return [...prev, ...eachDuplicateOfPrintingAndCondition]
                        } else {
                            return [...prev]
                        }

                    }, [])
                    return [...prev, ...eachConditionOfPrinting]
                }, [])
                return [...prev, ...eachPrintingOfItem]
            }
            return prev
        }, [])
        return items
    }

    const handleFindCount = (item_id, selectedPrintingId, selectedConditionId) => {
        return lotItemCounts[item_id] 
            ? lotItemCounts[item_id].count
                ? lotItemCounts[item_id].count[selectedPrintingId] 
                    ? lotItemCounts[item_id].count[selectedPrintingId][selectedConditionId]
                        ? lotItemCounts[item_id].count[selectedPrintingId][selectedConditionId]
                        : undefined
                    : undefined 
                : undefined
            : undefined
    }
   
    const countConfig = {
        handleAddItem,
        handleSubtractItem,
        handleFindCount,
    }

    return (<div className='selectItems page'>
        <Banner titleText={actionTitle} handleClickBackArrow={handleClickBackArrow} />
        <p>item count: {Object.keys(lotItemCounts).reduce((prev, itemId) => {
            if (lotItemCounts[itemId].count) {
                return Object.keys(lotItemCounts[itemId].count).reduce((prev, printingId) => {
                    return Object.keys(lotItemCounts[itemId].count[printingId]).reduce((prev, conditionId) => {
                        return lotItemCounts[itemId].count[printingId][conditionId] + prev
                    }, 0) + prev
                }, 0) + prev
            }
            return prev
        }, 0)}</p>
        {importTime && <label style={{ display: 'flex', flexDirection: 'column' }}>
            Import Time
            <input type="datetime-local" value={importTime} onChange={(e) => setImportTime(e.target.value)} />
        </label>}
        <button onClick={() => handleSelectItems(convertToItemArray())}>{actionTitle}</button>
        <div className='itemFinder'>
            <div style={{ display: 'flex', paddingTop: '12px' }}>
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
