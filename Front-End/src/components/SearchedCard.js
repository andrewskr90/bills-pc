import React from 'react'
import { useHistory } from 'react-router-dom'

const SearchedCard = (props) => {
    const { imgLink, price, setSearchedCardSelect, cardObj} = props

    const { push } = useHistory()

    const handleClick = () => {
        setSearchedCardSelect(cardObj)
        push('/searchedCard')
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