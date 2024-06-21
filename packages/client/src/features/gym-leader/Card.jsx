import React from 'react'
import { useNavigate } from 'react-router-dom'

const Card = (props) => {
    const { card } = props
    const cardImg = card.images.large
    
    const navigate = useNavigate()

    return (<>
        <div onClick={() => navigate(card.number)} className='card'>
            <img key={card.id} alt='' src={cardImg} />
        </div>
    </>)
}

export default Card
