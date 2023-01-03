import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import BillsPcService from '../../../../api/bills-pc'
import PreviousRoutes from '../../../../layouts/previous-routes'
import Item from '../../../../components/item'
import { applyMarketChanges } from '../../../../utils/market'
import { generateMarketItemSortCB } from '../../../../utils/sort'
import { filterMarketItems } from '../../../../utils/filter'
import { eligableMarketSearchParams } from '../../../../utils/params'
import '../../assets/marketplace.less'
import Toolbar from '../../../../layouts/toolbar'
import { escapeApostrophes } from '../../../../utils/string'
import ItemContainer from '../../../../components/item-container'

const SearchResults = (props) => {
    const { referenceData, setReferenceData } = props
    const [searchValue, setSearchValue] = useState('')
    const location = useLocation()
    const sortKey = 'itemSort'
    const filterKey = 'market'

    const searchMarketItems = async (category, searchValue) => {
        let marketSearchResults = []
        if (category === 'all' || category === 'cards') {
            if (searchValue === '') {
                await BillsPcService.getCardsV2WithValues()
                    .then(res => marketSearchResults = [
                        ...marketSearchResults,
                        ...res.data
                    ])
                    .catch(err => console.log(err))

            } else {
                await BillsPcService.getCardsV2WithValues({ searchValue })
                        .then(res => marketSearchResults = [
                        ...marketSearchResults,
                        ...res.data
                    ])
                        .catch(err => console.log(err))
            }
        } if (category === 'all' || category === 'products') {
            if (searchValue === '') {
                await BillsPcService.getProductsWithValues()
                    .then(res => marketSearchResults = [
                        ...marketSearchResults,
                        ...res.data
                    ])
                    .catch(err => console.log(err))

            } else {
                await BillsPcService.getProductsWithValues({ searchValue })
                        .then(res => marketSearchResults = [
                        ...marketSearchResults,
                        ...res.data
                    ])
                        .catch(err => console.log(err))
            }
        }
        return { data: marketSearchResults }
    }

    const conditionSearchString = (value) => {
        return escapeApostrophes(value)
    }

    useEffect(() => {
        const verifiedParams = eligableMarketSearchParams(location)
        setSearchValue(verifiedParams.value)
        if (verifiedParams) {
            const { category, value } = verifiedParams
            const conditionedValue = conditionSearchString(value)
            searchMarketItems(category, conditionedValue)
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
            dataObject={referenceData}
            setDataObject={setReferenceData}
        />
        {referenceData.marketSearchResults.length > 0
        ?
        <ItemContainer>
            {applyMarketChanges(filterMarketItems(referenceData.marketSearchResults, referenceData.filter.market)).sort(generateMarketItemSortCB(referenceData, sortKey)).map(result => {
                return <Item referenceData={referenceData} item={result} />
            })}
        </ItemContainer>
        :
        <></>
        }
    </div>)
}

export default SearchResults
