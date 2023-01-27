import React, { useState, useEffect } from 'react'
import Item from '../item'
import Search from '../../features/search'
import { searchForItems } from '../../utils/search'
import './assets/selectItem.less'
import { applyMarketChanges } from '../../utils/market'
import ItemContainer from '../item-container'
import BackArrow from '../buttons/back-arrow'

const SelectItem = (props) => {
    const { referenceData,
        handleSelectItem,
        initialEmptyMessage
    } = props
    const [loading, setLoading] = useState(false)
    const [searchedItems, setSearchedItems] = useState([])
    const [emptyMessage, setEmptyMessage] = useState(initialEmptyMessage)

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

    return (<div className='selectItem'>
        <div className='header'>
            <div className='backAndTitle'>
                <BackArrow />
                <h2>Add Item</h2>
            </div>
            <Search submitSearch={submitSearch} />
        </div>
        <ItemContainer emptyMessage={emptyMessage} loading={loading}>
            {applyMarketChanges(searchedItems).map((item) => {
                const item_id = item.card_id || item.product_id
                return <Item key={item_id} item={item} referenceData={referenceData} handleSelectItem={handleSelectItem}/>
            })}
        </ItemContainer>
    </div>)
}

export default SelectItem
