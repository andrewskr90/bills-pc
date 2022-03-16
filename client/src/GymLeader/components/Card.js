import React from 'react'

const Card = (props) => {
    const { card } = props

    const cardImg = card.images.small


    return (<>
        <div className='card'>
            <img key={card.id} alt='' src={cardImg} />
        </div>
    </>)
}

export default Card