import React from 'react'

const SelectCard = (props) => {
    const { selectItemModalState, handleSearchFilterChange, selectSet, handleSelectCard } = props
    const { 
        itemType,
        cardFilterValue, 
        filteredSets,
        selectedSetCards,
    } = selectItemModalState

    return (<div className={itemType === 'card' ? 'addCardToTransaction':'hidden'}>
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
                const { card_image_small, card_id } = card
                return <img 
                    src={card_image_small} 
                    onClick={() => handleSelectCard(card)} 
                    className='selectedSetCard' 
                    id={card_id} 
                    key={card_id} 
                />
            })}
        </div>
    </div>)
}

export default SelectCard
