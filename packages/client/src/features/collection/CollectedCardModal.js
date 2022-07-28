import React, { useState, useEffect } from 'react'
import PtcgioService from '../../api/pokemon-tcg-io'

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

const CollectedCardModal = (props) => {
    const [ptcgioCard, setPtcgioCard] = useState(blankCard)
    const { 
        userClaims, 
        selectedCollectedCards, 
        handleViewCardPurchase, 
        handleCloseCardModal 
    } = props
    const {
        collected_card_average_price,
        collected_card_quantity,
        collection
    } = selectedCollectedCards
    console.log(selectedCollectedCards)
    const {
        card_name,
        set_name,
        set_language,
        sale_card_price,
        card_image_large,
        card_image_small,
        sale_card_sale_id,
        collected_card_note_note,
        set_ptcgio_id,
        card_number
    } = collection[0]
    
    useEffect(() => {
        const ptcgioCardId = `${set_ptcgio_id}-${card_number}`
        PtcgioService.getCardById(ptcgioCardId)
            .then(res => {
                setPtcgioCard(res.data.data[0])
            })
            .catch(err => {
                console.log(err)
            })
    }, [])
    
    return (<div className='collectedCardsModal modalBackground'>
        <div className='modalContent'>
            <div className='collectedCardInfo'>
                <h3>Purchases</h3>
                <div className='purchases'>
                    {collection.map(purchase => {
                        return (<div className='collectedCard'>
                            <div className='collectedCardImg'>
                                <div className='price'>
                                    <p>${purchase.sale_card_price}</p>
                                </div>
                                <img src={card_image_large}/>
                            </div>
                            <div id={purchase.sale_card_sale_id} className='purchasedCard' onClick={handleViewCardPurchase}>
                                    <div className='note'>
                                        <p className='bold'>Note:</p>
                                        <p>{purchase.collected_card_note_note}</p>
                                    </div>
                                <button onClick={handleViewCardPurchase} id={purchase.sale_card_sale_id} className="originalPurchase"><p>View Sale</p></button>
                            </div>
                        </div>)
                    })}
                </div>
                {/* <h3>Average Cost:</h3> */}
                {/* <div className='averageCost'>
                    <h2 className='collectedCardPurchasePrice'>{collected_card_average_price}</h2>
                </div> */}
                <h3>Market Prices:</h3>
                <div className='marketPriceTypes'>
                    {ptcgioCard.tcgplayer
                    ? Object.keys(ptcgioCard.tcgplayer.prices).map(rarity => {
                        return <div key={`${ptcgioCard.id}-${rarity}`} className='rarities'>
                            <p>{rarity}</p>
                            <p className=''>{ptcgioCard.tcgplayer.prices[rarity].market}</p>
                            {/* <div className='priceTypes'> */}
                                
                                {/* {Object.keys(ptcgioCard.tcgplayer.prices[rarity]).map(priceType => {
                                    return <div className='priceType'>
                                        <p>{priceType}</p>
                                        <p>{ptcgioCard.tcgplayer.prices[rarity][priceType]}</p>
                                    </div>
                                })} */}
                            {/* </div> */}
                        </div>
                    })
                    :
                    <></>
                    }
                </div>
                <button onClick={handleCloseCardModal} className="modalClose"><p>X</p></button>
            </div>
        </div>
    </div>)
}

export default CollectedCardModal
