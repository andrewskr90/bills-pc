import React from 'react'

const Card = (props) => {
    const { imgLink, card, price} = props

    const handleClick = () => {

    }

    return (
        <div
            onClick={handleClick} 
            style={{width:'100px',
            display: 'flex',
            flexDirection:'column',
            }}
        >
            <img src={imgLink}
                style={{
                    width:'100px'
                }}
            />
            <p>Market Price:{price.market}</p>
        </div>
    )
}

export default Card