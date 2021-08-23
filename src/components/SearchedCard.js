import React from 'react'

const SearchedCard = (props) => {
    const { imgLink, 
        // prices 
    } = props
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
            {/* <p>TCG Player Market Price:{prices}</p> */}
        </div>
    )
}

export default SearchedCard