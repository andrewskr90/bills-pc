import React, { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import ItemsTable from './feature/items-table'
import { initialPurchaseValues } from '../../data/initialData'
import SelectItem from '../../components/select-item'
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

    const updatePurchaseValues = (e) => {
        let { name, value, id } = e.target

        let updateDate = purchaseValues.date
        let updateVendor = purchaseValues.vendor
        let updateCards = purchaseValues.cards
        let updateProducts = purchaseValues.products
        let updateItemCount = purchaseValues.itemCount
        let updateDiscount = purchaseValues.discount
        let updateSubtotal = purchaseValues.subtotal
        let updateShipping = purchaseValues.shipping
        let updateTaxRate = purchaseValues.taxRate
        let updateTaxAmount = purchaseValues.taxAmount
        let updateTotal = purchaseValues.total
        let updateSaleNote = purchaseValues.saleNote
        const idx = parseInt(id)

        if (name === 'quantity' || name === 'retail' || name === 'cardNote') {
            if (name === 'quantity') {
                value = Math.ceil(value)
            } else if (name === 'retail') {
                value = Math.round(value*100) /100
            }
            updateItemCount = 0
            updateSubtotal = 0
            updateCards = purchaseValues.cards.map((card, j) => {
                if (idx === j) {
                    if (name === 'quantity') {
                        updateItemCount += value
                        updateSubtotal += value * card.retail
                    } else if (name === 'retail') {
                        updateItemCount += card.quantity
                        updateSubtotal += value * card.quantity
                    } else if (name === 'cardNote') {
                        //TODO: card notes need to be in an array
                        //when handling the sale in the backend
                        updateItemCount += card.quantity
                        updateSubtotal += card.retail * card.quantity
                    }
                    const updatedCard = {
                        ...card,
                        [name]: value
                    }
                    return updatedCard
                } else {
                    updateItemCount += card.quantity
                    updateSubtotal += card.quantity * card.retail
                    return card
                }
            })    

            updateSubtotal = Math.round(updateSubtotal*100) /100
            updateTotal = updateSubtotal
        } else if (name === 'date') {
            updateDate = value
        } else if (name === 'vendor') {
            updateVendor = value
        } else if (name === 'discount') {
            updateDiscount = Math.round(value*100) /100
        } else if (name === 'shipping') {
            updateShipping = Math.round(value*100) /100
        } else if (name === 'taxRate') {
            updateTaxRate = Math.round(value*100) /100
        } else if (name === 'taxAmount') {
            updateTax = Math.round(value*100) /100
        } else if (name === 'total') {
            updateTotal = Math.round(value*100) /100
        } else if (name === 'saleNote') {
            updateSaleNote = value
        }

        let beforeTax = updateSubtotal-updateDiscount+updateShipping
        if (beforeTax > 0) {
            updateTaxRate = Math.round((updateTotal - beforeTax) / (beforeTax)*10000) / 100
            updateTaxAmount = Math.round((updateTotal - beforeTax)*100) /100
        }
        setPurchaseValues({
            date: updateDate,
            vendor: updateVendor,
            cards: updateCards,
            products: updateProducts,
            itemCount: updateItemCount,
            subtotal: updateSubtotal,
            discount: updateDiscount,
            shipping: updateShipping,
            taxRate: updateTaxRate,
            taxAmount: updateTaxAmount,
            total: updateTotal,
            saleNote: updateSaleNote
        })
    }

    const handleSelectItem = (item) => {
        let itemCount = purchaseValues.itemCount + 1
        if (item.card_id) {
            const purchasedCard = {
                ...item,
                quantity: 1,
                retail: 0,
                cardNote: ''
            }
            setPurchaseValues({
                ...purchaseValues,
                itemCount: itemCount,
                cards: [
                    ...purchaseValues.cards,
                    purchasedCard
                ]
            })
        } else if (item.product_id) {
            const purchasedProduct = {
                ...item,
                quantity: 1,
                retail: 0,
                productNote: ''
            }
            setPurchaseValues({
                ...purchaseValues,
                itemCount: itemCount,
                products: [
                    ...purchaseValues.products,
                    purchasedProduct
                ]
            })
        }
        navigate(-1)
    }
    
    const removeCardFromPurchase = (e) => {
        const id = e.currentTarget.id
        const filteredArray = purchaseValues.cards.filter(card => {
            if (id === card.card_v2_id) {
                return false
            } else {
                return true
            }
        })
        setPurchaseValues({
            ...purchaseValues,
            cards: filteredArray
        })
    } 

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
    console.log(purchaseValues)
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
                        removeCardFromPurchase={removeCardFromPurchase}
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
                                type='number'
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
                                type='number'
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
                    <Button onClick={onClick}>Update</Button>
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
        </Routes>
    </div>)
}

export default ImportPurchase
