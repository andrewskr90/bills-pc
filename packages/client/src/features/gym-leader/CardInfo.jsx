import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const blankCard = {
    tcgplayer: {
        prices: {
            normal: {
                directLow: '',
                high: '',
                low: '',
                market: '',
                mid: ''
            }
        }
    },
    images: {
        large: ''
    }
}

const CardInfo = (props) => {
    const [card, setCard] = useState(blankCard)
    const { currentSetCards } = props
    const { setId, cardNumber } = useParams()
    const navigate = useNavigate()

    useEffect(() => {   
        if (currentSetCards.length > 0) {
            const [currentCard] = currentSetCards.filter(card => {
                return card.number === cardNumber
            })
            setCard(currentCard)
        }
    }, [currentSetCards])

    return (<div key={card.id}>
        {currentSetCards.length === 0
        ?
        <h2>Loading...</h2>
        :
        <div className='cardInfo'>
            <button onClick={() => navigate(`/gym-leader/card-manager/ptcgio/${setId}`)}>back</button>
            <img src={card.images.large} />
            <div className='cardRarities'>
                {card.tcgplayer
                ? Object.keys(card.tcgplayer.prices).map(rarity => {
                    return <div key={`${card.id}-${rarity}`} className='cardRarity'>
                        <h3>{rarity} prices</h3>
                        <div className='priceTypes'>
                            {Object.keys(card.tcgplayer.prices[rarity]).map(priceType => {
                                return <div className='priceType'>
                                    <h3>{priceType}</h3>
                                    <p>{card.tcgplayer.prices[rarity][priceType]}</p>
                                </div>
                            })}
                        </div>
                    </div>
                })
                :
                <></>
                }
            </div>
        </div>
        }
    </div>)
}

export default CardInfo
