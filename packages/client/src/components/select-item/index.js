import React, { useState, useEffect } from 'react'
import BillsPcService from '../../api/bills-pc'
import Item from '../item'
import Search from '../../features/search'
import { searchForItems } from '../../utils/search'
import { initialSelectItemModalState } from '../../data/initialData'
import './assets/selectItem.less'
import { applyMarketChanges } from '../../utils/market'
import { useNavigate } from 'react-router-dom'
import ItemContainer from '../item-container'
import BackArrow from '../buttons/back-arrow'

const SelectItem = (props) => {
    const { referenceData,
        setReferenceData,
        handleSelectItem 
    } = props
    const [selectItemModalState, setSelectItemModalState] = useState(initialSelectItemModalState)
    const [searchedItems, setSearchedItems] = useState([])
    const { 
        selectedSetCards,
    } = selectItemModalState
    const navigate = useNavigate()

    useEffect(() => {
        //filtering by set
        if (selectItemModalState.cardFilterBy === 'sets') {
            let count = 0
            const filteredSets = referenceData.sets.filter((set, idx) => {
                const setName = set.set_v2_name.toLowerCase()
                const substring = selectItemModalState.cardFilterValue.toLowerCase()
                if (count <= 10 && setName.includes(substring)) {
                    count ++
                    set.cardDataIndex = idx
                    return set
                } else {
                    return false
                }
            })
            setSelectItemModalState({
                ...selectItemModalState,
                filteredSets: filteredSets
            })
        }
        //other filters 
    }, [selectItemModalState.cardFilterValue])

    useEffect(() => {
        if (selectItemModalState.selectedSetCards.length > 0) {
            const updatedSetCards = referenceData.sets.map((set, idx) => {
                if (idx === selectItemModalState.selectedSetIndex) {
                    const updatedSet = {
                        ...set,
                        cards: selectItemModalState.selectedSetCards
                    }
                    return updatedSet
                } else {
                    return set
                }
            })
            setReferenceData({
                ...referenceData,
                sets: updatedSetCards
            })
        }
    }, [selectItemModalState.selectedSetCards])

    const submitSearch = (relayedSearch) => {
        searchForItems(relayedSearch.category, relayedSearch.value)
            .then(res => setSearchedItems(res.data))
            .catch(err => console.log(err))
    }

    const handleSearchFilterChange = (e) => {
        const { name, value } = e.target
        setSelectItemModalState({
            ...selectItemModalState,
            [name]: value,
            filteredSets: [],
            // selectedSetId: '',
            // selectedSetIndex: '',
            selectedSetCards: [],
        })
    }

    const selectSet = (set) => { 
        const { cardDataIndex, set_v2_id } = set
        const selectedSetItems = referenceData.sets[cardDataIndex].items
        if (selectedSetItems.length > 0) {
            setSelectItemModalState({
                ...selectItemModalState,
                selectedSetCards: selectedSetCards,
                cardFilterValue: ''
            })
        } else {
            BillsPcService.getCardsV2BySetId(set_v2_id)
                .then(res => {
                    setSelectItemModalState({
                        ...selectItemModalState,
                        selectedSetCards: res.data,
                        cardFilterValue: '',
                        selectedSetIndex: cardDataIndex
                    })
                }).catch(err => {
                    console.log(err)
                })
        }
    }

    return (<div className='selectItem'>
        <div className='backAndTitle'>
            <BackArrow />
            <h2>Add Item</h2>
        </div>
        <Search submitSearch={submitSearch} />
        <ItemContainer>
            {applyMarketChanges(searchedItems).map((item) => {
                const item_id = item.card_id || item.product_id
                return <Item key={item_id} item={item} referenceData={referenceData} handleSelectItem={handleSelectItem}/>
            })}
        </ItemContainer>
    </div>)
}

export default SelectItem
