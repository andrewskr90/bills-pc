import React from 'react'

const PurchaseCardsModal = (props) => {
    const { selectedPurchaseCards, selectCollectedCards, handleClosePurchaseModal } = props
    const {
        sale_date,
        sale_total,
        sale_notes,
        sale_vendor,
        sale_note_note
    } = selectedPurchaseCards[0]
    
    return (<div className='purchaseCardsModal modalBackground'>
        <div className='modalContent'>
            <div className="purchaseCards">
                <h2>Purchase Cards</h2>
                <div>
                    {selectedPurchaseCards.map(purchase => {
                        const { card_id, card_image_small } = purchase
                        return <img onClick={selectCollectedCards} id={card_id} className='purchaseCard' src={card_image_small} />
                    })}
                </div>
            </div>
            <div className="purchaseInfo">
                <div className="purchaseDate">
                    <h3>Date:</h3>
                    <p>{sale_date}</p>
                </div>
                <div className="itemCount">
                    <h3>Item Quantity:</h3>
                    <h3>{selectedPurchaseCards.length}</h3>
                </div>
                <div className="totalCost">
                    <h3>Total Cost:</h3>
                    <h3>{sale_total}</h3>
                </div>
                <div className="saleVendor">
                    <h3>Sale Vendor:</h3>
                    <p>{sale_vendor}</p>
                </div>
                <div className="purchaseNote">
                    <h3>Purchase Note:</h3>
                    <p>{sale_note_note}</p>
                </div>
                <button onClick={handleClosePurchaseModal} className="modalClose"><p>X</p></button>
            </div>
        </div>
    </div>)
}

export default PurchaseCardsModal
