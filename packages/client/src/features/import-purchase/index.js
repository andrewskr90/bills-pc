import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { removeLeadingZeroes } from '../../utils/validation'
import PurchaseItems from './PurchaseItems'
import PurchaseDetails from './PurchaseDetails'

const initialPurchaseValues = {
    date: '',
    vendor: '',
    cards: [],
    products: [],
    itemCount: 0,
    subtotal: 0,
    discount: 0,
    shipping: 0,
    taxRate: 0,
    taxAmount: 0,
    total: 0,
    saleNote: ''
}

const ImportPurchase = (props) => {
    const [purchaseValues, setPurchaseValues] = useState(initialPurchaseValues)

    const { 
        referenceData, 
        setReferenceData 
    } = props

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

    return (<div className='page importPurchase'>
        <h3>Import Purchase</h3>
        <Routes>
            <Route 
                path='/' 
                element={<PurchaseItems 
                    referenceData={referenceData} 
                    setReferenceData={setReferenceData} 
                    purchaseValues={purchaseValues}
                    setPurchaseValues={setPurchaseValues}
                    updatePurchaseValues={updatePurchaseValues}
                />} 
            />
            <Route 
                path='/details' 
                element={<PurchaseDetails 
                    purchaseValues={purchaseValues}
                    updatePurchaseValues={updatePurchaseValues}
                />} 
            />
        </Routes>
    </div>)
}

export default ImportPurchase
