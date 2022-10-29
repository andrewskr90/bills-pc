import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BillsPcService from '../../api/bills-pc'
import SelectCard from './SelectCard'
import { initialSelectItemModalState } from '../../data/initialData'

const SelectItemModal = (props) => {
    const [selectItemModalState, setSelectItemModalState] = useState(initialSelectItemModalState)
    const { 
        referenceData, 
        setReferenceData, 
        setAddItemModal,
        handleSelectCard
    } = props
    
    useEffect(() => {
        //filtering by set
        if (selectItemModalState.cardFilterBy === 'sets') {
            let count = 0
            const filteredSets = referenceData.sets.filter((set, idx) => {
                const setName = set.set_name.toLowerCase()
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
        const { cardDataIndex, set_id } = set
        const selectedSetCards = referenceData.sets[cardDataIndex].cards
        if (selectedSetCards) {
            setSelectItemModalState({
                ...selectItemModalState,
                selectedSetCards: selectedSetCards,
                cardFilterValue: ''
            })
        } else {
            BillsPcService.getCardsBySetId(set_id)
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

    return (<div className='modal addItemModal'>
        <div className='modalContent'>
                {/* select card or product */}
                <div className='itemTypeButtons'>
                    <button 
                        onClick={() => setSelectItemModalState({ ...selectItemModalState, itemType: 'card' })} 
                        className={`smallButton addItemModal${selectItemModalState.itemType === 'card' ? ' selected':''}`}
                    >
                        Add card
                    </button>
                    <button 
                        onClick={() => setSelectItemModalState({ ...selectItemModalState, itemType: 'product' })} 
                        className={`smallButton addItemModal${selectItemModalState.itemType === 'product' ? ' selected':''}`}
                    >
                        Add product
                    </button>
                </div>

                {/* add card */}
                <SelectCard 
                    selectItemModalState={selectItemModalState}
                    handleSearchFilterChange={handleSearchFilterChange}
                    handleSelectCard={handleSelectCard}
                    selectSet={selectSet}
                />
                
                {/* add product */}
                <div className={selectItemModalState.itemType === 'product' ? 'addProductToTransaction':'hidden'}>
                    <p>Feature Not Available.</p>
                </div>    
            <button className='modalClose' onClick={() => setAddItemModal(false)}>X</button>      
        </div>
    </div>
    )
}

export default SelectItemModal
