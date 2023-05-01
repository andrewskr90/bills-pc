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

    const updatePurchaseItem = (editedItem, i) => {
        const updatedPurchaseItems = purchaseValues.items.map((item, j) => {
            if (i === j) {
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
            itemNote: ''
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

    const seperateCardsAndProducts = (purchaseValues) => {
        const saleItems = purchaseValues.items
        const saleCards = saleItems.filter(item => item.card_id)
        const saleProducts = saleItems.filter(item => item.product_id)
        return {
            ...purchaseValues,
            cards: saleCards,
            products: saleProducts
        }
    }

    const handleUpdateCollection = (e) => {
        e.preventDefault()
        BillsPcService.postTransactionSales([seperateCardsAndProducts(purchaseValues)])
            .then(res => {
                setPurchaseValues({
                    ...initialPurchaseValues,
                    date: purchaseValues.date
                })
                // navigate('/')
            }).catch(err => {
                console.log(err)
            })
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
                    <div className='labelInput purchaserNote'>
                        <label>Note</label>
                        <input 
                            id='purchaserNote'
                            className='purchaserNote'
                            name='purchaserNote'
                            type='text'
                            value={purchaseValues.purchaserNote}
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
