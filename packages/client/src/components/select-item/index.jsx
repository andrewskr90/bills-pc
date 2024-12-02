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
import { useLocation, useNavigate } from 'react-router-dom'
import { buildPreviousRoute } from '../../utils/location'
import PageSelection from '../page-selection/index.jsx'

const SelectItem = (props) => {
    const { 
        referenceData,
        setReferenceData,
        handleSelectItem,
        initialEmptyMessage,
    } = props
    const [loading, setLoading] = useState(false)
    const [searchedItems, setSearchedItems] = useState([])
    const [emptyMessage, setEmptyMessage] = useState(initialEmptyMessage)
    const sortKey = 'itemSort'
    const filterKey = 'market'
    const navigate = useNavigate()
    const [count, setCount] = useState()
    const [isGrid, setIsGrid] = useState(false)
    const location = useLocation()

    const submitSearch = (value) => {
        if (value !== params.searchvalue) {
            setLoading(true)
            const params = buildParams(location)
            params.includePrintings = true
            // TODO match this function to other `submitSearch` implimentations
            // searchForItems(value, params)
            //     .then(res => {
            //         setEmptyMessage('No results found.')
            //         setSearchedItems(res.data.items)
            //         setCount(res.data.count)
            //         setLoading(false)
            //     })
            //     .catch(err => {
            //         console.log(err)
            //         setLoading(false)
            //     })
        }
    }

    const handleClickBackArrow = () => {
        navigate(buildPreviousRoute(location))
    }

    return (<div className='selectItem page'>
        <Banner titleText={'Add'} handleClickBackArrow={handleClickBackArrow} />
        <div className='itemFinder'>
            <Search submitSearch={submitSearch} />
            <Toolbar 
                viewRangeSelector={true} 
                filterKey={filterKey}
                referenceData={referenceData} 
                setReferenceData={setReferenceData}
                sortKey={sortKey}
                defaultSortDirection={'asc'}
            />
            <PageSelection location={location} count={count} />
            <ItemContainer emptyMessage={emptyMessage} loading={loading}>
                {applyMarketChanges(
                    filterMarketItems(searchedItems, referenceData.filter[filterKey])).sort(generateMarketItemSortCB(referenceData, sortKey)).map((item) => {
                    return <Item 
                        key={item.id} 
                        item={item} 
                        referenceData={referenceData} 
                        handleSelectItem={handleSelectItem} 
                        isGrid={isGrid} 
                    />
                })}
                <PageSelection location={location} count={count} />
            </ItemContainer>
        </div>
    </div>)
}

export default SelectItem
