import React from 'react'

const FilterModal = (props) => {
    const { referenceData, marketData, setMarketData, showFilterModal, setShowFilterModal } = props

    const toggleFilter = (filter, active) => {
        // const filterType = Object.keys(filter)[0]
        if (!active) {
            const newFiltersArray = marketData.filters
            newFiltersArray.push(filter)
            setMarketData({
                ...marketData,
                filters: newFiltersArray
            })
        } else {
            setMarketData({
                ...marketData,
                filters: marketData.filters.filter(toRemove => {
                    if (Object.keys(filter)[0] === Object.keys(toRemove)[0]) {
                        if (toRemove[Object.keys(toRemove)[0]] !== filter[Object.keys(filter)[0]]) {
                            return toRemove
                        }
                    } else {
                        return toRemove !== filter
                    }
                })
            })
        }
    }

    const clearFilters = () => {
        setMarketData({
            ...marketData,
            filters: []
        })
    }

    const itemTypes = ['Card', 'Product']

    return (<div className={showFilterModal ? 'modalBackground' : 'hidden'}>
        <div className='modalContent filterModal'>
            <h2>Filters</h2>
            <div className='filterSection'>
                <p>Item Type</p>
                <div className='filterBubbles'>
                    {itemTypes.map(itemType => {
                        let active = false
                        marketData.filters.forEach(filter => {
                            if (Object.keys(filter)[0] === 'itemType') {
                                if (filter['itemType'] === itemType) {
                                    active = true
                                }
                            }
                        })
                        return <div className={`filterBubble ${active ? 'active' : ''}`} onClick={() => toggleFilter({ itemType: itemType }, active)}>
                            <p>{itemType}</p>
                        </div>
                    })}
                </div>
            </div>
            <div className='filterSection'>
                <p>Card Rarity</p>
                <div className='filterBubbles'>
                    {referenceData.rarities.map(rarity => {
                        let active = false
                        marketData.filters.forEach(filter => {
                            const currentFilterType = Object.keys(filter)[0]
                            if (currentFilterType === 'rarity') {
                                if (filter['rarity'] === rarity) {
                                    active = true
                                }
                            }
                        })
                        return <div className={`filterBubble ${active ? 'active' : ''}`} onClick={() => toggleFilter({ rarity: rarity }, active)}>
                            <p>{rarity}</p>
                        </div>
                    })}
                </div>
            </div>
            <div className='clearAndClose'>
                <button onClick={clearFilters}>Clear All</button>
                <button onClick={() => setShowFilterModal(false)}>Close</button>
            </div>
        </div>
    </div>)
}

export default FilterModal
