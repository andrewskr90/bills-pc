import React from 'react'
import { useNavigate } from 'react-router-dom'

const PurchaseItems = (props) => {
    const { removeCardFromPurchase, purchaseValues, updatePurchaseValues } = props
    const navigate = useNavigate()

    return (<div className='purchaseItems'>
        <div className='purchaseItemsHeader row'>
            <p className='image'>Item</p>
            <p className='quantity'>Qty</p>
            <p className='retail'>Retail</p>
            <p className='note'>Note</p>
            <button onClick={() => navigate('add-item')}>+</button>
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

export default PurchaseItems
