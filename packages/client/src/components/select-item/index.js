import React, { useState, useEffect } from 'react'
import BillsPcService from '../../api/bills-pc'
import { initialSelectItemModalState } from '../../data/initialData'
import './assets/selectItem.less'

const SelectItem = (props) => {
    const { addItemModal,
        setAddItemModal,
        referenceData,
        setReferenceData,
        handleSelectCard 
    } = props
    const [selectItemModalState, setSelectItemModalState] = useState(initialSelectItemModalState)
    const { 
        itemType,
        cardFilterValue, 
        filteredSets,
        selectedSetCards,
    } = selectItemModalState

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

    return (addItemModal
    ?
        <div className='selectItem'>
            <div className={itemType === 'card' ? 'addCardToTransaction':'hidden'}>
                <label>Filter By</label>
                <div className='cardFilter'>
                    <select name='cardFilterBy' id='cardFilterBy'>
                        <option value='sets'>Sets</option>
                    </select>
                    <div className='filterBySets'>
                        <input 
                            type='text'
                            name='cardFilterValue'
                            value={cardFilterValue}
                            onChange={handleSearchFilterChange}
                        />
                        <div className={cardFilterValue ? 'filterResults' : 'hidden'}>
                            {filteredSets.map(set => {
                                return <div 
                                    onClick={() => selectSet(set)} 
                                    className='filterResult' 
                                    id={set.cardDataIndex} 
                                    key={set.cardDataIndex}
                                >
                                    <p>{set.set_v2_name}</p>
                                </div>
                            })}
                        </div>
                    </div>
                </div>
                <div className={selectedSetCards.length > 0 ? 'selectedSetCardsComponent' : 'hidden'}>
                    {selectedSetCards.map((card) => {
                        const { card_v2_tcgplayer_product_id, card_v2_id } = card
                        return <img 
                            src={`https://product-images.tcgplayer.com/fit-in/656x656/${card_v2_tcgplayer_product_id}.jpg`} 
                            onClick={() => handleSelectCard(card)} 
                            className='selectedSetCard' 
                            id={card_v2_id} 
                            key={card_v2_id} 
                        />
                    })}
                </div>
            </div>
            <button className='modalClose' onClick={() => setAddItemModal(false)}>X</button>      
        </div>
    :
    <></>
    )
}

export default SelectItem
