import React from 'react'
import CollectedCard from './CollectedCard'

const CollectedCards = (props) => {
    const { collectedCards, selectCollectedCards } = props
    return (<div className='collectedCards'>
        {collectedCards.map(card => {
            return <CollectedCard card={card} selectCollectedCards={selectCollectedCards} />
        })}
    </div>)
}

export default CollectedCards
