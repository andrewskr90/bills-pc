import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import BillsPcService from '../../../../api/bills-pc'
import PreviousRoutes from '../../../../layouts/previous-routes'
import ExpansionItem from '../../ExpansionItem'
import { applyMarketChanges } from '../../../../utils/market'
import { generateMarketItemSortCB } from '../../../../utils/sort'
import { filterMarketItems } from '../../../../utils/filter'
import { eligableMarketSearchParams } from '../../../../utils/params'
import '../../assets/marketplace.less'
import Toolbar from '../../../../layouts/toolbar'

const SearchResults = (props) => {
    const { referenceData, setReferenceData } = props
    const [searchValue, setSearchValue] = useState('')
    const location = useLocation()
    const sortKey = 'itemSort'
    const filterKey = 'expansionItemFilters'

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

    useEffect(() => {
        const verifiedParams = eligableMarketSearchParams(location)
        setSearchValue(verifiedParams.value)
        if (verifiedParams) {
            const { category, value } = verifiedParams
            searchMarketItems(category, value)
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
            viewFilter={true} 
            viewSort={true}
            viewRangeSelector={true}
            filterKey={filterKey}
            referenceData={referenceData}
            setReferenceData={setReferenceData}
            dataObject={referenceData}
            setDataObject={setReferenceData}
            sortKey={sortKey}
        />
        {referenceData.marketSearchResults.length > 0
        ?
        <div className='expansionItems'>
            {applyMarketChanges(filterMarketItems(referenceData.marketSearchResults, referenceData)).sort(generateMarketItemSortCB(referenceData, sortKey)).map(result => {
                return <ExpansionItem referenceData={referenceData} item={result} />
            })}
        </div>
        :
        <></>
        }
    </div>)
}

export default SearchResults
