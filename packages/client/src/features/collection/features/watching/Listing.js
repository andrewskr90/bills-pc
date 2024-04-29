import React, { useEffect, useState } from 'react'
import { Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { initialListingValues } from '../../../../data/initialData'
import PurchaseWatchedListing from './PurchaseWatchedListing'
import BillsPcService from '../../../../api/bills-pc'

const Listing = (props) => {
    const [listing, setListing] = useState(initialListingValues)

    const navigate = useNavigate()
    const { id } = useParams()
    useEffect(() => {
        (async () => {
            const result = await BillsPcService.getListingById(id)
            setListing(result.data[0])
        })()
    }, [])
    const handlePurchaseListing = () => {
        navigate('purchase')
    }

    return (
        <Routes>
            <Route path='/' element={
                listing.id ? 
                    <div style={{ height: '100%', overflow: 'auto', marginBottom: '64px' }}>
                        <p>{listing.date}</p>
                        <p>{listing.sellerName}</p>
                        <p>{listing.price}</p>
                        <button onClick={handlePurchaseListing}>Purchase</button>
                        {listing.lot.id && (
                            <div>
                                <p>Listing Market Value: {listing.lot.items.reduce((a, c) => {
                                    if (parseFloat(c.market_price_price)) return a + parseFloat(c.market_price_price)
                                    return a
                                }, 0)}</p>
                                {listing.lot.items
                                    .sort((a,b) => {
                                        if (a.market_price_price < b.market_price_price) return 1
                                        if (a.market_price_price > b.market_price_price) return -1
                                        return 0
                                    }).map(item => {
                                    return <div>
                                        <p>{item.card_v2_name || item.product_name}</p>
                                        <p>{item.market_price_price}</p>
                                    </div>
                                })}
                            </div>
                        )}
                        {listing.collectedCard.id && (
                            <div>
                                <p>{listing.collectedCard.card_v2_name}</p>
                                <p>{listing.collectedCard.market_price_price}</p>
                            </div>
                        )}
                        {listing.collectedCard.id && (
                            <div>
                                <p>{listing.collectedProduct.product_name}</p>
                                <p>{listing.collectedProduct.market_price_price}</p>
                            </div>
                        )}
                    </div>
                : <></>
            } />
            <Route path='/purchase' element={<PurchaseWatchedListing listing={listing} />}/>
        </Routes>
    )
}

export default Listing
