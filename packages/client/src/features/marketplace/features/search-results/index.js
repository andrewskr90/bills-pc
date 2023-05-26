import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PreviousRoutes from '../../../../layouts/previous-routes'
import Item from '../../../../components/item'
import { applyMarketChanges } from '../../../../utils/market'
import { generateMarketItemSortCB } from '../../../../utils/sort'
import { filterMarketItems } from '../../../../utils/filter'
import { eligableMarketSearchParams } from '../../../../utils/params'
import '../../assets/marketplace.less'
import Toolbar from '../../../../layouts/toolbar'
import ItemContainer from '../../../../components/item-container'
import { searchForItems } from '../../../../utils/search'

const SearchResults = (props) => {
    const { referenceData, setReferenceData } = props
    const [searchValue, setSearchValue] = useState('')
    const location = useLocation()
    const sortKey = 'itemSort'
    const filterKey = 'market'
    const navigate = useNavigate()

    useEffect(() => {
        const verifiedParams = eligableMarketSearchParams(location)
        setSearchValue(verifiedParams.value)
        if (verifiedParams) {
            const { category, value } = verifiedParams
            searchForItems(category, value)
                .then(res => {
                    setReferenceData({
                        ...referenceData,
                        marketSearchResults: res.data
                    })
                })
                .catch(err => console.log(err))
        } else {
            setReferenceData({
                ...referenceData,
                marketSearchResults: []
            })
        }
    }, [location])

    const handleSelectItem = (item) => {
        const expansionId = item.set.id
        const itemId = item.card_id || item.product_id
        navigate(`/market/${expansionId}/${itemId}`)
    }

    return (<div className='searchResults'>
        <PreviousRoutes location={location} referenceData={referenceData} />
        <div className='title'>
            <h3>{`Search Results for "${searchValue}"`}</h3>
        </div>
        <Toolbar 
            viewRangeSelector={true}
            sortKey={sortKey}
            filterKey={filterKey}
            referenceData={referenceData}
            setReferenceData={setReferenceData}
        />
        {referenceData.marketSearchResults.length > 0
        ?
        <ItemContainer>
            {applyMarketChanges(filterMarketItems(referenceData.marketSearchResults, referenceData.filter.market)).sort(generateMarketItemSortCB(referenceData, sortKey)).map(result => {
                return <Item referenceData={referenceData} item={result} handleSelectItem={handleSelectItem} />
            })}
        </ItemContainer>
        :
        <></>
        }
    </div>)
}

export default SearchResults
