import React from 'react'

const CardsToolbar = (props) => {
    const { resetCurrentSet, handlePostCardsToCards, currentSetObject } = props

    return (<>
        <div className='cardsToolbar'>
            <h2>Current Set: {currentSetObject.name}</h2>
            <button onClick={resetCurrentSet}>Clear Search Results</button>
            <div className='buttonDiv'>
                <p>POST all cards to Cards Table</p>
                <button onClick={handlePostCardsToCards}>POST</button>
            </div>
        </div>
    </>)
}

export default CardsToolbar