import React from 'react'
import Card from './Card'

const SearchResults = (props) => {
    const { cardArray } = props

    return (
        <div style={{display:'flex', flexWrap:'wrap'}}>
            {cardArray.map(card=> {
                return <Card key={card.id} imgLink={card.images.small} card={card} price={card.tcgplayer.prices.normal || card.tcgplayer.prices.holofoil} />
            })}
        </div>
    )
}

export default SearchResults