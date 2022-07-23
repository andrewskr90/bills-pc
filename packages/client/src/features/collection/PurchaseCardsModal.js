import React from 'react'

const PurchaseCardsModal = (props) => {
    const { selectedPurchaseCards, selectCollectedCard, handleClosePurchaseModal } = props
    const {
        sale_date,
        sale_total,
        sale_notes,
        sale_vendor,
        sale_note_note
    } = selectedPurchaseCards[0]
    
    return (<div className='purchaseCardsModal modalBackground'>
        <div className="purchaseCards">
            {selectedPurchaseCards.map(purchase => {
                const { collected_card_id, card_image_small } = purchase
                return <img onClick={selectCollectedCard} id={collected_card_id} className='purchaseCard' src={card_image_small} />
            })}
        </div>
        <div className="purchaseInfo">
            <div className="purchaseDate">
                <h2>Purchase From:</h2>
                <p>{sale_date}</p>
            </div>
            <div className="itemCount">
                <p>Purchased Card Count:</p>
                <p>{selectedPurchaseCards.length}</p>
            </div>
            <div className="totalCost">
                <p>Total Cost:</p>
                <p>{sale_total}</p>
            </div>
            <div className="saleVendor">
                <p>Sale Vendor:</p>
                <p>{sale_vendor}</p>
            </div>
            <div className="purchaseNote">
                <p>Purchase Note:</p>
                <p>"{sale_note_note}"</p>
            </div>
            <button onClick={handleClosePurchaseModal} className="modalClose"><h2>X</h2></button>
        </div>
    </div>)
}

export default PurchaseCardsModal
