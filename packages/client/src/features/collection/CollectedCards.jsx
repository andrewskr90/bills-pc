import React from 'react'
import { Link } from 'react-router-dom'
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
            <p>Update your collection with a purchase.</p>
            <Link to='update'>
                <button>Update Collection</button>
            </Link>
        </div>
        }
    </>)
}

export default CollectedCards
