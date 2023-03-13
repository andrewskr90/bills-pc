import React, { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import ItemsTable from './feature/items-table'
import { initialPurchaseValues } from '../../data/initialData'
import SelectItem from '../../components/select-item'
import EditItem from '../../components/edit-item'
import BillsPcService from '../../api/bills-pc'
import PlusButton from '../../components/buttons/plus-button'
import './assets/importPurchase.less'
import Button from '../../components/buttons/text-button'

const ImportPurchase = (props) => {
    const [purchaseValues, setPurchaseValues] = useState(initialPurchaseValues)
    const { 
        referenceData, 
        setReferenceData 
    } = props
    
    const navigate = useNavigate()
    const initialEmptyMessage = 'Search for an item to add to your purchase.'

    const updatePurchaseItem = (editedItem) => {
        let editedItemId = editedItem.card_id || editedItem.product_id
        const updatedPurchaseItems = purchaseValues.items.map(item => {
            if (item.card_id === editedItemId || item.product_id === editedItemId) {
                return editedItem
            } else return item
        })
        setPurchaseValues({
            ...purchaseValues,
            items: updatedPurchaseItems
        })
    }

    const updatePurchaseValues = (e) => {
        let { name, value } = e.target
        let updatedValue = value
        setPurchaseValues({
            ...purchaseValues,
            [name]: updatedValue
        })
    }

    const handleSelectItem = (item) => {
        const purchasedItem = {
            ...item,
            quantity: 1,
            retail: null,
            cardNote: ''
        }
        setPurchaseValues({
            ...purchaseValues,
            items: [
                ...purchaseValues.items,
                purchasedItem
            ]
        })
        navigate(-1)
    }
    
    const removeItemFromPurchase = (itemId) => {
        const filteredArray = purchaseValues.items.filter(item => {
            if (itemId === item.card_id || itemId === item.product_id) {
                return false
            } else {
                return true
            }
        })
        setPurchaseValues({
            ...purchaseValues,
            items: filteredArray
        })
    } 

    const handleUpdateCollection = (e) => {
        e.preventDefault()
        console.log(purchaseValues)
        // BillsPcService.postTransactionSales(purchaseValues)
        //     .then(res => {
        //         console.log(res)
        //         navigate('/')
        //     }).catch(err => {
        //         console.log(err)
        //     })
    }


    return (<div className='page importPurchase'>
        <Routes>
            <Route 
                path='/' 
                element={<form className='purchaseForm'>
                    <div className='dateAndVendor'>
                        <div className='labelInput date'>
                            <label>Date</label>
                            <input 
                                id='date'
                                className='date'
                                name='date'
                                type='date'
                                value={purchaseValues.date}
                                onChange={updatePurchaseValues}
                            />
                        </div>
                        <div className='labelInput vendor'>
                            <label>Vendor</label>
                            <input 
                                id='vendor'
                                className='vendor'
                                name='vendor'
                                type='text'
                                value={purchaseValues.vendor}
                                onChange={updatePurchaseValues}
                            />
                        </div>
                    </div>
                    <div className='labelInput saleNote'>
                        <label>Note</label>
                        <input 
                            id='saleNote'
                            className='saleNote'
                            name='saleNote'
                            type='text'
                            value={purchaseValues.saleNote}
                            onChange={updatePurchaseValues}
                        />
                    </div>
                    <label className='items'>Items</label>
                    <ItemsTable 
                        purchaseValues={purchaseValues}
                        updatePurchaseValues={updatePurchaseValues}
                    />
                    <PlusButton handleClick={() => navigate('add-item')} />
                    <div className='discountSubtotalAndTax'>
                        <div className='labelInput discount'>
                            <label>Discount</label>
                            <input 
                                id='discount'
                                className='discount'
                                name='discount'
                                type='text'
                                value={purchaseValues.discount}
                                onChange={updatePurchaseValues}
                            />
                        </div>
                        <div className='labelInput subtotal'>
                            <label>Subtotal</label>
                            <input 
                                id='subtotal'
                                className='subtotal'
                                name='subtotal'
                                type='text'
                                value={purchaseValues.subtotal}
                                onChange={updatePurchaseValues}
                            />
                        </div>
                        <div className='labelInput taxAmount'>
                            <label>Tax</label>
                            <input 
                                id='taxAmount'
                                className='taxAmount'
                                name='taxAmount'
                                type='text'
                                value={purchaseValues.taxAmount}
                                onChange={updatePurchaseValues}
                            />
                        </div>
                    </div>
                    <div className='shippingAndTotal'>
                        <div className='labelInput shipping'>
                            <label>Shipping</label>
                            <input 
                                id='shipping'
                                className='shipping'
                                name='shipping'
                                type='text'
                                value={purchaseValues.shipping}
                                onChange={updatePurchaseValues}
                            />
                        </div>
                        <div className='labelInput total'>
                            <label>Total</label>
                            <input 
                                id='total'
                                className='total'
                                name='total'
                                type='text'
                                value={purchaseValues.total}
                                onChange={updatePurchaseValues}
                            />
                        </div>
                    </div>
                    <Button onClick={handleUpdateCollection}>Update</Button>
                </form>} 
            />
            <Route 
                path='/add-item'
                element={<SelectItem 
                    referenceData={referenceData}
                    setReferenceData={setReferenceData}
                    handleSelectItem={handleSelectItem}
                    initialEmptyMessage={initialEmptyMessage}
                />}
            />
            <Route 
                path='/edit-item/:idx'
                element={<EditItem 
                    purchaseValues={purchaseValues}
                    updatePurchaseItem={updatePurchaseItem}
                    removeItemFromPurchase={removeItemFromPurchase}
                />}
            />
        </Routes>
    </div>)
}

export default ImportPurchase
