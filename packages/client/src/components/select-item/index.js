import React, { useState, useEffect } from 'react'
import Item from '../item'
import Search from '../../features/search'
import { searchForItems } from '../../utils/search'
import './assets/selectItem.less'
import { applyMarketChanges } from '../../utils/market'
import ItemContainer from '../item-container'
import Banner from '../../layouts/banner'
import Toolbar from '../../layouts/toolbar'
import { filterMarketItems } from '../../utils/filter'
import { generateMarketItemSortCB } from '../../utils/sort'

const SelectItem = (props) => {
    const { referenceData,
        setReferenceData,
        handleSelectItem,
        initialEmptyMessage
    } = props
    const [loading, setLoading] = useState(false)
    const [searchedItems, setSearchedItems] = useState([])
    const [emptyMessage, setEmptyMessage] = useState(initialEmptyMessage)
    const sortKey = 'itemSort'
    const filterKey = 'market'

    const submitSearch = (relayedSearch) => {
        setLoading(true)
        searchForItems(relayedSearch.category, relayedSearch.value)
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

    return (<div className='selectItem page'>
        <Banner titleText={'Add Item'}>
            <Search submitSearch={submitSearch} />
            <Toolbar 
                viewRangeSelector={true} 
                filterKey={filterKey}
                referenceData={referenceData} 
                setReferenceData={setReferenceData}
                sortKey={sortKey}
            />
        </Banner>
        <ItemContainer emptyMessage={emptyMessage} loading={loading}>
            {applyMarketChanges(
                filterMarketItems(searchedItems, referenceData.filter[filterKey])).sort(generateMarketItemSortCB(referenceData, sortKey)).map((item) => {
                const item_id = item.card_id || item.product_id
                return <Item key={item_id} item={item} referenceData={referenceData} handleSelectItem={handleSelectItem}/>
            })}
        </ItemContainer>
    </div>)
}

export default SelectItem
