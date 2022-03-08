import React from 'react'
import SearchedCard from './SearchedCard'

const SearchResults = (props) => {
    const { cardArray, setSearchedCardSelect } = props

    return (
        <div style={{display:'flex', flexWrap:'wrap'}}>
            {cardArray.map(card=> {
                return <SearchedCard 
                        key={card.id} 
                        imgLink={card.images.small} 
                        cardObj={card} 
                        price={card.tcgplayer.prices.normal || card.tcgplayer.prices.holofoil} 
                        setSearchedCardSelect={setSearchedCardSelect}/>
            })}
        </div>
    )
}

export default SearchResults