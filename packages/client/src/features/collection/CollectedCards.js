import React from 'react'
import CollectedCard from './CollectedCard'

const CollectedCards = (props) => {
    const { collectedCards, selectCollectedCards } = props
    return (<>
        {collectedCards.length > 0
        ?
        <div className='collectedCards'>
            {collectedCards.map(card => {
                return <CollectedCard card={card} selectCollectedCards={selectCollectedCards} />
            })}
        </div>
        :
        <div className='emptyCollection page'>
            <p>No items in your collection!</p>
            <Link to='/import'>
                <button>Add Items</button>
            </Link>
        </div>
        }
    </>)
}

export default CollectedCards
