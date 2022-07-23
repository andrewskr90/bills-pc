import React from 'react'

const CollectedCards = (props) => {
    const { collectedCards, selectCollectedCard } = props

    return (<div className='collectedCards'>
        {collectedCards.map(card => {
            const { collected_card_id, card_image_small } = card
            return <img 
                className='collectedCard' 
                id={collected_card_id} 
                src={card_image_small}
                onClick={selectCollectedCard} 
            />
        })}
    </div>)
}

export default CollectedCards
