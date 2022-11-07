import React from 'react'

const FilterModal = (props) => {
    const { referenceData, setReferenceData, showFilterModal, setShowFilterModal, filterKey } = props

    const toggleFilter = (filter) => {
        if (filter[Object.keys(filter)[0]] === false) {
            filter[Object.keys(filter)[0]] = true
            const newFiltersArray = referenceData[filterKey]
            newFiltersArray.push(filter)
            setReferenceData({
                ...referenceData,
                [filterKey]: newFiltersArray
            })
        } else {
            setReferenceData({
                ...referenceData,
                [filterKey]: referenceData[filterKey].filter(toCompare => {
                    if (Object.keys(filter)[0] === Object.keys(toCompare)[0]) {
                        return false
                    } else {
                        return true
                    }
                })
            })
        }
    }

    const clearFilters = () => {
        setReferenceData({
            ...referenceData,
            [filterKey]: []
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
                        referenceData[filterKey].forEach(filter => {
                            if (Object.keys(filter)[0] === itemType) {
                                active = true
                            }
                        })
                        return <div className={`filterBubble ${active ? 'active' : ''}`} onClick={() => toggleFilter({ [itemType]: active })}>
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
                        referenceData[filterKey].forEach(filter => {
                            if (Object.keys(filter)[0] === rarity) {
                                active = true
                            }
                        })
                        return <div className={`filterBubble ${active ? 'active' : ''}`} onClick={() => toggleFilter({ [rarity]: active }, active)}>
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
