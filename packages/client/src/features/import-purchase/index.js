import React, { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import ItemsTable from './feature/items-table'
import { initialPurchaseValues, purchaseInitialSplitValues } from '../../data/initialData'
import SelectItem from '../../components/select-item'
import EditItem from '../../components/edit-item'
import BillsPcService from '../../api/bills-pc'
import PlusButton from '../../components/buttons/plus-button'
import './assets/importPurchase.less'
import Button from '../../components/buttons/text-button'
import BulkEditor from '../../components/bulk-editor'

const ImportPurchase = (props) => {
    const [purchaseValues, setPurchaseValues] = useState(initialPurchaseValues)
    const { 
        referenceData, 
        setReferenceData
    } = props
    const [addItemOrBulk, setAddItemOrBulk] = useState('item')
    
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

    const updateBulkSplits = (updatedBulkSplits) => {
        setPurchaseValues({
            ...purchaseValues,
            bulkSplits: updatedBulkSplits
        })
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

    const formatImportPurchaseValues = (purchaseValues) => {
        const saleItems = purchaseValues.items
        const cards = saleItems.filter(item => item.card_id)
        const products = saleItems.filter(item => item.product_id)
        const bulkSplits = purchaseValues.bulkSplits
        return {
            ...purchaseValues,
            cards,
            products,
            bulkSplits
        }
    }

    const handleUpdateCollection = (e) => {
        e.preventDefault()
        BillsPcService.postTransactionSales([formatImportPurchaseValues(purchaseValues)])
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

    const handleSelectTypeToAdd = (e) => {
        setAddItemOrBulk(e.target.value)
    }

    const handleToggleSelectItem = () => navigate('add-item')
    const handleToggleAddBulk = () => navigate('add-bulk')

    const addSplitToPurchase = (split) => {
        setPurchaseValues({
            ...purchaseValues,
            bulkSplits: [
                ...purchaseValues.bulkSplits,
                split
            ]
        })
        navigate('/gym-leader/collection/update/purchase')
    }

    const updateSplitInBulkValues = (updatedSplit, idx) => {
        const updatedBulkSplits = purchaseValues.bulkSplits.map((split, i) => {
            if (i === parseInt(idx)) return updatedSplit
            return split
        })
        setPurchaseValues({
            ...purchaseValues,
            bulkSplits: updatedBulkSplits
        })
        navigate('/gym-leader/collection/update/purchase')
    }

    const purchaseItemsValue = () => {
        let value = 0
        purchaseValues.items.forEach(item => {
            value += item.quantity*(item.marketValue)
        })
        return value
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
                    <select 
                        className='addItemOrBulk' 
                        onChange={handleSelectTypeToAdd}
                        value={addItemOrBulk}
                        style={{ width: '25%', marginTop: '10px' }}
                    >
                        <option value='item'>Item</option>
                        <option value='bulk'>Bulk</option>
                    </select>
                    {addItemOrBulk === 'item' ? <>
                        <ItemsTable 
                            format='item'
                            items={purchaseValues.items}
                            referenceData={referenceData}
                        />
                        <PlusButton handleClick={handleToggleSelectItem} />                                
                    </> : <>
                        <ItemsTable 
                            format='bulk'
                            items={purchaseValues.bulkSplits}
                            referenceData={referenceData}
                        />
                        <PlusButton handleClick={handleToggleAddBulk} />
                    </>}
                    <p>Market Value: {purchaseItemsValue()}</p>
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
                    <Button style={{ marginTop: '10px' }} onClick={handleUpdateCollection}>Update</Button>
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
                    includeRetail={true}
                    purchaseValues={purchaseValues}
                    updatePurchaseItem={updatePurchaseItem}
                    removeItemFromPurchase={removeItemFromPurchase}
                />}
            />
            <Route 
                path='/add-bulk'
                element={<BulkEditor 
                    initialSplitValues={purchaseInitialSplitValues}
                    addSplitToTransaction={addSplitToPurchase}
                    referenceData={referenceData}
                />}
            />
            <Route 
                path='/edit-bulk/:idx'
                element={<BulkEditor 
                    initialSplitValues={purchaseInitialSplitValues}
                    referenceData={referenceData}
                    updateSplitInBulkValues={updateSplitInBulkValues}
                    purchaseValues={purchaseValues}
                />}
            />
        </Routes>
    </div>)
}

export default ImportPurchase
