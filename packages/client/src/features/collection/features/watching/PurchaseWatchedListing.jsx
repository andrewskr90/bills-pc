import React, { useState } from 'react';
import { convertLocalToUTC } from '../../../../utils/date';
import Button from '../../../../components/buttons/text-button/index.jsx';
import BillsPcService from '../../../../api/bills-pc'

const initialOfferValues = { amount: undefined, accepted: false, rejected: false }
const initialDiscountValues = { amount: undefined, percentage: undefined }

const PurchaseWatchedListing = ({ listing }) => {
    const [sale, setSale] = useState({ 
        shipping: undefined, 
        tax: undefined, 
        time: undefined,
        discounts: [],
        notes: []
    })
    const [acceptedOffer, setAcceptedOffer] = useState(false)
    const [offer, setOffer] = useState(initialOfferValues)
    const [listingDiscount, setListingDiscount] = useState(initialDiscountValues)
    const [saleDiscount, setSaleDiscount] = useState(initialDiscountValues)
    const [saleNote, setSaleNote] = useState(undefined)
    const handleChangeSale = (e) => {
        setSale({
            ...sale,
            [e.target.name]: e.target.value
        })
    }
    const toggleAcceptedOffer = () => {
        if (acceptedOffer) {
            setOffer(initialOfferValues)
        }
        setAcceptedOffer(!acceptedOffer)
    }
    const handleChangeListingOffer = (e) => {
        setOffer({
            ...offer,
            [e.target.name]: e.target.value,
            accepted: true
        })
    }
    const handleChangeListingDiscount = (e) => {
        setListingDiscount({
            ...listingDiscount,
            [e.target.name]: e.target.value
        })
    }
    const handleChangeSaleDiscount = (e) => {
        setSaleDiscount({
            ...saleDiscount,
            [e.target.name]: e.target.value
        })
    }

    const handleConfirmPurchase = async (e) => {
        e.preventDefault();
        const data = {
            sale: {
                ...sale,
                time: convertLocalToUTC(sale.time),
                discounts: saleDiscount.amount ? [saleDiscount] : [],
                notes: saleNote ? [{ note: saleNote }] : []
            },
            listing: {
                id: listing.id,
                discounts: listingDiscount.amount ? [listingDiscount] : [],
                offers: offer.amount ? [offer] : []
            }
        }
        const params = { listing: true }
        await BillsPcService.postSale({ data, params })
            .then(res => console.log(res))
            .catch(err => console.log(err))
    }

    return (
        listing.id ? (<>
            <form className='mt-5 mb-24' style={{ marginTop: '20px' }}>  
                <h3>Purchase Listing</h3>
                <div style={{ marginTop: '10px' }}>
                    <label>Time</label>
                    <input 
                        id='time'
                        name='time'
                        type='datetime-local'
                        value={sale.time}
                        onChange={handleChangeSale}
                    />
                </div>
                <div>
                    <div style={{ display: 'flex', marginTop: '10px' }}>
                        <label>Listing Price</label>
                        <p>{listing.price}</p>
                    </div>
                    <div className='flex flex-grow-0 mt-3'>
                        <label>An offer was accepted</label>
                        <input 
                            type="checkbox"
                            onChange={toggleAcceptedOffer}
                            checked={acceptedOffer} 
                        />
                    </div>
                    {acceptedOffer && (
                        <div style={{ display: 'flex', marginTop: '10px' }}>
                            <label>Offer Price</label>
                            <input 
                                name="amount"
                                type="number"
                                value={offer.amount}
                                onChange={handleChangeListingOffer}
                            />
                        </div>
                    )}
                </div>
                <div className='mt-3'>
                    <label>Listing Discount</label>
                    <input 
                        name="amount"
                        type="number"
                        value={listingDiscount.amount}
                        onChange={handleChangeListingDiscount}
                    />
                </div>
                <div className='mt-3'>
                    <label>Sale Discount</label>
                    <input 
                        name="amount"
                        type="number"
                        value={saleDiscount.amount}
                        onChange={handleChangeSaleDiscount}
                    />
                </div>
                <div className='mt-3'>
                    <label>Shipping</label>
                    <input 
                        name="shipping"
                        type="number"
                        value={sale.shipping}
                        onChange={handleChangeSale}
                    />
                </div>
                <div className='mt-3'>
                    <label>Tax</label>
                    <input 
                        name="tax"
                        type="number"
                        value={sale.tax}
                        onChange={handleChangeSale}
                    />
                </div>
                <div className='mt-3'>
                    <label>Purchase Note</label>
                    <input 
                        name='note'
                        type='text'
                        value={saleNote}
                        onChange={(e) => setSaleNote(e.target.value)}
                    />
                </div>
                <Button 
                    style={{ marginTop: '10px' }} 
                    onClick={handleConfirmPurchase}
                >Confirm Purchase</Button>
            </form>
        </>) : (<>
            <p style={{ marginTop: '20px' }}>...loading listing</p>
        </>)
    )
}

export default PurchaseWatchedListing;
