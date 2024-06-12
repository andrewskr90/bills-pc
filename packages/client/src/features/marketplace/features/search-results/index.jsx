import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PreviousRoutes from '../../../../layouts/previous-routes/index.jsx'
import Item from '../../../../components/item/index.jsx'
import { applyMarketChanges } from '../../../../utils/market'
import { generateMarketItemSortCB } from '../../../../utils/sort'
import { filterMarketItems } from '../../../../utils/filter'
import { eligableMarketSearchParams } from '../../../../utils/params'
import '../../assets/marketplace.less'
import Toolbar from '../../../../layouts/toolbar/index.jsx'
import ItemContainer from '../../../../components/item-container/index.jsx'
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
            const { value } = verifiedParams
            searchForItems(value)
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
        navigate(`/market/${expansionId}/${item.id}`)
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
                return <Item key={result.id} referenceData={referenceData} item={result} handleSelectItem={handleSelectItem} />
            })}
        </ItemContainer>
        :
        <></>
        }
    </div>)
}

export default SearchResults
