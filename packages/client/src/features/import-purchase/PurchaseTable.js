import React from 'react'

const PurchaseTable = (props) => {
    const { setAddItemModal, removeCardFromPurchase, purchaseValues, updatePurchaseValues } = props

    return (<div className='purchaseTable'>
    <div className='purchaseItemsHeader row'>
        <p className='image'>Item</p>
        <p className='quantity'>Qty</p>
        <p className='retail'>Retail</p>
        <p className='note'>Note</p>
        <button onClick={() => setAddItemModal(true)}>+</button>
    </div>
    {purchaseValues.cards.map((card, idx) => {
        const { card_v2_id, quantity, retail, card_v2_tcgplayer_product_id } = card
        return <div key ={card_v2_id} className='row'>
            <div className='image'>
                <img src={`https://product-images.tcgplayer.com/fit-in/656x656/${card_v2_tcgplayer_product_id}.jpg`} />
            </div>
            <input 
                id={idx}
                className='quantity'
                type='number'
                min='1'
                step='1'
                name='quantity'
                value={purchaseValues.cards[idx].quantity}
                onChange={updatePurchaseValues}
            />
            <input 
                id={idx}
                className='retail'
                type='number'
                min='0'
                step='.01'
                name='retail'
                value={purchaseValues.cards[idx].retail}
                onChange={updatePurchaseValues}
            />
            <input 
                id={idx}
                className='note'
                type='text'
                name='cardNote'
                value={purchaseValues.cards[idx].cardNote}
                onChange={updatePurchaseValues}
            />
            <button id={card_v2_id} onClick={removeCardFromPurchase}>x</button>
        </div>
    })}
</div>)
}

export default PurchaseTable
