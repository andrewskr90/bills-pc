import React from 'react'

const Cards = (props) => {

    const { resetCurrentSet, currentSetCards } = props
    return (<>
        <button onClick={resetCurrentSet}>Clear Search Results</button>
        <div className='searchResults'>
            {currentSetCards.map(card => {
                const cardImg = card.images.small
                return <img alt='' src={cardImg}/>
            })}
        </div>
        </>)
}

export default Cards