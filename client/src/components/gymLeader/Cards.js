import React from 'react'
import Card from './Card'

const Cards = (props) => {

    const { currentSetCards } = props
    return (<>
        <div className='cards'>
            {currentSetCards.map(card => {
                return <Card key={card.id} card={card} />
            })}
        </div>
        </>)
}

export default Cards