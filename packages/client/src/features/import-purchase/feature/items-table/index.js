import React from 'react'
import { useNavigate } from 'react-router-dom'
import EditPNG from '../../../collection/assets/edit.png'
import './assets/itemsTable.less'

const ItemsTable = (props) => {
    const { items, format } = props
    const navigate = useNavigate()
    
    const handleEditItem = (idx) => {
        navigate(`edit-item/${idx}`)
    }

    const handleEditBulk = (idx) => {
        navigate(`edit-bulk/${idx}`)
    }
    return (<table className='itemsTable'>
        {format === 'item' ? <>
            <tr className='header'>
                <th className='name'>Name</th>
                <th className='price'>Price</th>
                <th className='quantity'>Qty</th>
                <th className='edit'></th>
            </tr>
            {items.map((card, idx) => {
                const { card_v2_id } = card
                return <>
                    <tr className='spacer'></tr>
                    <tr key ={card_v2_id} className='tableItem'>
                        <td className='name'>{items[idx].name}</td>
                        <td className='price'>{items[idx].retail}</td>
                        <td className='quantity'>{items[idx].quantity}</td>
                        <td className='edit'>
                            <img onClick={() => handleEditItem(idx)} className='pointer' src={EditPNG} />
                        </td>
                    </tr>
                </>
            })}
        </> : <>
            <tr className='header'>
                <th className='name'>Split</th>
                <th className='price'>Rate</th>
                <th className='quantity'>Count</th>
                <th className='edit'></th>
            </tr>
            {items.map((split, idx) => {
            return <tr key={idx} className='tableItems'>
                <td className='name'>{`${split.labels.length} label(s)`}</td>
                <td className='price'>{split.rate}</td>
                <td className='quantity'>{split.count}</td>
                <td className='edit'>
                    <img onClick={() => handleEditBulk(idx)} className='pointer' src={EditPNG} />
                </td>
            </tr>
        })}
        </>}
    </table>)
}

export default ItemsTable
