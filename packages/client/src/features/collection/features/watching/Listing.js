import React, { useEffect, useState } from 'react'
import { Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { initialListingValues } from '../../../../data/initialData'
import PurchaseWatchedListing from './PurchaseWatchedListing'
import BillsPcService from '../../../../api/bills-pc'

const Listing = (props) => {
    const [listing, setListing] = useState(initialListingValues)
    const [sortKey, setSortKey] = useState('marketPrice')
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
                        <p>{listing.time}</p>
                        <p>{listing.sellerName}</p>
                        <p>{listing.listingPrice}</p>
                        <button onClick={handlePurchaseListing}>Purchase</button>
                        {listing.lot.id && (
                            <div>
                                <p>Listing Market Value: {listing.lot.items.reduce((a, c) => {
                                    if (parseFloat(c.marketPrice)) return a + parseFloat(c.marketPrice)
                                    return a
                                }, 0)}</p>
                                <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
                                    <option value='marketPrice'>Market Value</option>
                                    <option value='setName'>Set</option>
                                    <option value='name'>Name</option>
                                </select>
                                {listing.lot.items
                                    .sort((a,b) => {
                                        if (a.name < b.name) return -1
                                        if (a.name > b.name) return 1
                                        return 0
                                    })
                                    .sort((a,b) => {
                                        if (a[sortKey] < b[sortKey]) return sortKey === 'marketPrice' ? 1 : -1
                                        if (a[sortKey] > b[sortKey]) return sortKey === 'marketPrice' ? -1 : 1
                                        return 0
                                    }).map(item => {
                                    return <div>
                                        <p>{item.name}</p>
                                        <p>{item.marketPrice}</p>
                                    </div>
                                })}
                            </div>
                        )}
                        <div>
                            <p>{listing.collectedItem.name}</p>
                            <p>{listing.collectedItem.marketPrice}</p>
                        </div>
                    </div>
                : <></>
            } />
            <Route path='/purchase' element={<PurchaseWatchedListing listing={listing} />}/>
        </Routes>
    )
}

export default Listing
