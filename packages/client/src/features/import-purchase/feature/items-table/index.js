import React from 'react'
import { useNavigate } from 'react-router-dom'
import './assets/itemsTable.less'

const ItemsTable = (props) => {
    const { removeCardFromPurchase, purchaseValues, updatePurchaseValues } = props
    const navigate = useNavigate()

    return (<div className='itemsTable'>
        <table>
            <tr className='header'>
                <th className='name'>Name</th>
                <th className='price'>Price</th>
                <th className='quantity'>Qty</th>
                <th classname='edit'></th>
            </tr>
        </table>
        {purchaseValues.cards.map((card, idx) => {
            const { card_v2_id, quantity, retail, card_v2_tcgplayer_product_id } = card
            return <div key ={card_v2_id} className='items'>
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
        <button onClick={() => navigate('add-item')}>+</button>
    </div>)
}

export default ItemsTable
