import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PurchaseTable from './PurchaseTable'
import SelectItemModal from './SelectItemModal' 

const PurchaseItems = (props) => {
    const [addItemModal, setAddItemModal] = useState(false)
    const { 
        referenceData, 
        setReferenceData,
        purchaseValues,
        setPurchaseValues,
        updatePurchaseValues 
    } = props
    const navigate = useNavigate()

    const handleSelectCard = (card) => {
        const purchasedCard = {
            ...card,
            quantity: 1,
            retail: 0,
            cardNote: ''
        }
        let itemCount = purchaseValues.itemCount + 1
        setPurchaseValues({
            ...purchaseValues,
            itemCount: itemCount,
            cards: [
                ...purchaseValues.cards,
                purchasedCard
            ]
        })
        setAddItemModal(false)
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

    return (<div className='purchaseItems'>
        <PurchaseTable 
            setAddItemModal={setAddItemModal}
            removeCardFromPurchase={removeCardFromPurchase}
            purchaseValues={purchaseValues}
            updatePurchaseValues={updatePurchaseValues}
        />
        <button 
            onClick={() => navigate('details')} 
            disabled={purchaseValues.cards.length < 1}
        >Continue
        </button>

        <div className='purchaseDetails'>
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
        </div>



        {addItemModal
        ?
        <SelectItemModal 
            addItemModal={addItemModal}
            setAddItemModal={setAddItemModal}
            referenceData={referenceData}
            setReferenceData={setReferenceData}
            handleSelectCard={handleSelectCard}
            purchaseValues={purchaseValues}
        />
        :
        <></>}
    </div>)
}

export default PurchaseItems
