import React from 'react'
import { useNavigate } from 'react-router-dom'
import BillsPcService from '../../api/bills-pc'

const PurchaseDetails = (props) => {
    const { purchaseValues, updatePurchaseValues } = props

    const navigate = useNavigate()

    const handleImportPurchase = (e) => {
        e.preventDefault()

        BillsPcService.postTransactionSales(purchaseValues)
            .then(res => {
                console.log(res)
                navigate('/')
            }).catch(err => {
                console.log(err)
            })
    }

    return (<div className='purchaseDetails'>
        <div>
            <p>Date</p>
            <input 
                id='date'
                className=''
                name='date'
                type='date'
                value={purchaseValues.date}
                onChange={updatePurchaseValues}
            />
        </div>
        <div>
            <p>Vendor</p>
            <input 
                id='vendor'
                className=''
                name='vendor'
                type='text'
                value={purchaseValues.vendor}
                onChange={updatePurchaseValues}
            />
        </div>
        <div>
            <p>Note</p>
            <input 
                id='saleNote'
                className=''
                name='saleNote'
                type='text'
                value={purchaseValues.saleNote}
                onChange={updatePurchaseValues}
            />
        </div>
        <div>
            <p>Item Count:</p>
            <p>{purchaseValues.itemCount}</p>
        </div>
        <div>
            <p>Subtotal</p>
            <p>{purchaseValues.subtotal}</p>
        </div>
        <div>
            <p>Discount</p>
            <input 
                id='discount'
                className=''
                name='discount'
                type='number'
                value={purchaseValues.discount}
                onChange={updatePurchaseValues}
            />
        </div>
        <div>
            <p>Shipping</p>
            <input 
                id='shipping'
                className=''
                name='shipping'
                type='number'
                value={purchaseValues.shipping}
                onChange={updatePurchaseValues}
            />
        </div>
        <div>
            <p>Tax Rate</p>
            <p>{purchaseValues.taxRate}</p>
        </div>
        <div>
            <p>Tax Amount</p>
            <p>{purchaseValues.taxAmount}</p>
        </div>
        <div>
            <p>Total</p>
            <input 
                id='total'
                className=''
                name='total'
                type='number'
                value={purchaseValues.total}
                onChange={updatePurchaseValues}
            />
        </div>
        <div className='buttons'>
            <button onClick={() => navigate('/import')}>back</button>
            <button onClick={handleImportPurchase}>Confirm</button>
        </div>
    </div>)
}

export default PurchaseDetails
