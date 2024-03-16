import React, { useEffect, useState } from 'react';
import { localYYYYMMDD } from '../../../../utils/date';
import Button from '../../../../components/buttons/text-button';
import BillsPcService from '../../../../api/bills-pc'

const PurchaseWatchedListing = ({ listing }) => {
    const [saleBody, setSaleBody] = useState({ 
        id: undefined,
        date: localYYYYMMDD(), 
        note: '', 
        discount: 0, 
        tax: 0 , 
        shipping: 0,
        listings: [],
    })

    useEffect(() => {
        setSaleBody({
            ...saleBody,
            listings: [{ 
                id: listing.id, 
                sellerId: listing.sellerId, 
                price: listing.price,
                offer: undefined
            }]

        })
    }, [listing])

    const handleChange = (e) => {
        setSaleBody({
            ...saleBody,
            [e.target.name]: e.target.value
        })
    }

    const handleChangeListingOffer = (e, listingId) => {
        setSaleBody({
            ...saleBody,
            listings: saleBody.listings.map(listing => {
                if (listing.id !== listingId) return listing
                return {
                    ...listing,
                    offer: {
                        ...listing.offer,
                        [e.target.name]: e.target.value
                    }
                }
            })
        })
    }

    const handleConfirmPurchase = async (e) => {
        e.preventDefault();
        await BillsPcService.postSale({ 
            data: saleBody, 
            params: { listing: true } 
        }). then(res => console.log(res))
        .catch(err => console.log(err))
    }

    return (
        listing.id ? (<>
            <form style={{ marginTop: '20px' }}>  
                <h3>Purchase Listing</h3>
                <div style={{ marginTop: '10px' }}>
                    <label>Date</label>
                    <input 
                        id='date'
                        name='date'
                        type='date'
                        value={saleBody.date}
                        onChange={handleChange}
                    />
                </div>
                {saleBody.listings.map((listing, idx) => (
                    <div key={idx}>
                        <div style={{ display: 'flex', marginTop: '10px' }}>
                            <label>Listing Price</label>
                            <p>{listing.price}</p>
                        </div>
                        <div style={{ display: 'flex', marginTop: '10px' }}>
                            <label>An offer was accepted</label>
                            <input 
                                type="checkbox"
                                onChange={() => {
                                    setSaleBody({
                                        ...saleBody,
                                        listings: saleBody.listings.map(prevListing => {
                                            if (prevListing.id !== listing.id) return prevListing
                                            return {
                                                ...prevListing,
                                                offer: prevListing.offer === undefined ? { amount: listing.price } : undefined
                                            }
                                        })
                                    })
                                }}
                                checked={listing.offer !== undefined} 
                            />
                        </div>
                        {listing.offer !== undefined && (
                            <div style={{ display: 'flex', marginTop: '10px' }}>
                                <label>Offer Price</label>
                                <input 
                                    name="amount"
                                    type="number"
                                    value={listing.offer.amount}
                                    onChange={(e) => handleChangeListingOffer(e, listing.id)}
                                />
                            </div>
                        )}
                    </div>
                ))}
                <div style={{ marginTop: '10px' }}>
                    <label>Purchase Note</label>
                    <input 
                        name='note'
                        type='text'
                        value={saleBody.note}
                        onChange={handleChange}
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
