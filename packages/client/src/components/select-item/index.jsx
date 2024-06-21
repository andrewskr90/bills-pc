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
import { useNavigate } from 'react-router-dom'
import { buildPreviousRoute } from '../../utils/location'

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

    const submitSearch = (value) => {
        setLoading(true)
        searchForItems(value)
            .then(res => {
                setEmptyMessage('No results found.')
                setSearchedItems(res.data)
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
                setLoading(false)
            })
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
            />
            <ItemContainer emptyMessage={emptyMessage} loading={loading}>
                {applyMarketChanges(
                    filterMarketItems(searchedItems, referenceData.filter[filterKey])).sort(generateMarketItemSortCB(referenceData, sortKey)).map((item) => {
                    return <Item key={item.id} item={item} referenceData={referenceData} handleSelectItem={handleSelectItem}/>
                })}
            </ItemContainer>
        </div>
    </div>)
}

export default SelectItem
