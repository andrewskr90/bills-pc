import React from 'react'

const CollectedCard = (props) => {
    const { imgLink, price, setSearchedCardSelect, cardObj} = props


    return (
        <div 
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

export default CollectedCard