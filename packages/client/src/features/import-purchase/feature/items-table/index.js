import React from 'react'
import EditPNG from '../../../collection/assets/edit.png'
import './assets/itemsTable.less'

const ItemsTable = (props) => {
    const { purchaseValues } = props

    const handleEditItem = (idx) => {
        console.log('item to edit index,', idx)
    }

    return (<table className='itemsTable'>
        <tr className='header'>
            <th className='name'>Name</th>
            <th className='price'>Price</th>
            <th className='quantity'>Qty</th>
            <th className='edit'></th>
        </tr>
        {purchaseValues.cards.map((card, idx) => {
            const { card_v2_id } = card
            return <>
                <tr className='spacer'></tr>
                <tr key ={card_v2_id} className='tableItem'>
                    <td className='name'>{purchaseValues.cards[idx].name}</td>
                    <td className='price'>{purchaseValues.cards[idx].retail}</td>
                    <td className='quantity'>{purchaseValues.cards[idx].quantity}</td>
                    <td className='edit'>
                        <img onClick={() => handleEditItem(idx)} className='pointer' src={EditPNG} />
                    </td>
                </tr>
            </>
        })}
    </table>)
}

export default ItemsTable
