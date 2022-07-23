import React from 'react'

const CollectedCardModal = (props) => {
    const { 
        userClaims, 
        selectedCollectedCard, 
        handleViewCardPurchase, 
        handleCloseCardModal 
    } = props
    const {
        card_name,
        set_name,
        set_language,
        sale_card_price,
        card_image_large,
        sale_card_sale_id,
        collected_card_note_note 
    } = selectedCollectedCard

    return (<div className='collectedCardsModal modalBackground'>
        <div className='modalContent'>
            <img className='collectedCardImage' src={card_image_large}/>
            <div className='collectedCardInfo'>
                <p className='collectedCardTitle'>{userClaims.user_name}+'s {card_name}</p>
                <p className='collectedCardSet'>{set_name} ({set_language})</p>
                <p className='collectedCardPurchasePrice'>Purchase Price: {sale_card_price}</p>
                <button onClick={handleViewCardPurchase} id={sale_card_sale_id} className="originalPurchaseButton"><h2>Original Purchase</h2></button>
                <div><p>Note:</p><p>"{collected_card_note_note}"</p></div>
                <button onClick={handleCloseCardModal} className="modalClose"><h2>X</h2></button>
            </div>
        </div>
    </div>)
}

export default CollectedCardModal
