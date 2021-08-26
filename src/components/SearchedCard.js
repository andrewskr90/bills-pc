import React from 'react'

const SearchedCard = (props) => {
    const { imgLink, price, setSearchedCardSelect, cardObj} = props

    const handleClick = () => {
        setSearchedCardSelect(cardObj)
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

export default SearchedCard