import React from 'react'
import MarketplaceItems from './MarketplaceItems'
import RangeSelectors from './RangeSelectors'
import SetSelector from './SetSelector'
import SetFilters from './SetFilters'
import SetFilter from './SetFilter'
import FilterModal from './FilterModal'

const MarketplaceSetItems = (props) => {
    const {
        marketData,
        setMarketData,
        referenceData,
        openFilterModal,
        removeFilter,
        showFilterModal,
        setShowFilterModal
    } = props
    return (<div className='marketplaceSetItems'>
        <div className='selectorAndFilter'>
            <SetSelector marketData={marketData} setMarketData={setMarketData} />
            <SetFilters 
                marketData={marketData} 
                setMarketData={setMarketData} 
                openFilterModal={openFilterModal}
            />
        </div>
        <div className='filterBubbles'>
            {marketData.filters.map((filter, idx) => {
                return <SetFilter key={idx} filter={filter} removeFilter={removeFilter} />
            })}
        </div>
        <RangeSelectors 
            marketData={marketData} 
            setMarketData={setMarketData} 
        />
        <MarketplaceItems marketData={marketData} />
        <FilterModal 
            marketData={marketData} 
            setMarketData={setMarketData} 
            referenceData={referenceData} 
            showFilterModal={showFilterModal} 
            setShowFilterModal={setShowFilterModal}
        />
    </div>)
}

export default MarketplaceSetItems
