import React, { useEffect, useState } from 'react'
import { Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { initialListingValues } from '../../../../data/initialData'
import PurchaseWatchedListing from './PurchaseWatchedListing.jsx'
import BillsPcService from '../../../../api/bills-pc'
import EditWatchedListing from './EditWatchedListing.jsx'

const Listing = (props) => {
    const { referenceData, setReferenceData } = props
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
    const handleEditListing = () => navigate('edit')

    return (
        <Routes>
            <Route path='/' element={
                listing.id ? 
                    <div style={{ height: '100%', overflow: 'auto', marginBottom: '64px' }}>
                        <p>{listing.time}</p>
                        <p>{listing.sellerName}</p>
                        <p>{parseFloat(listing.listingPrices[0][1])}</p>
                        <button onClick={handleEditListing}>Edit</button>
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
                                    return <div style={{ marginBottom: '8px' }}>
                                        <p>{item.name}</p>
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start' }}>
                                            <p>{referenceData.bulk.condition.find(c => c.condition_id === item.conditionId).condition_name}</p>
                                            <p>--</p>
                                            <p>{referenceData.bulk.printing.find(p => p.printing_id === item.printingId).printing_name}</p>
                                            <p>--</p>
                                            <p>{item.marketPrice}</p>
                                        </div>
                                    </div>
                                })}
                            </div>
                        )}
                        {listing.collectedItem.id && (
                            <div style={{ marginBottom: '8px' }}>
                                <p>{listing.collectedItem.name}</p>
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start' }}>
                                    <p>{referenceData.bulk.condition.find(c => c.condition_id === listing.collectedItem.conditionId).condition_name}</p>
                                    <p>--</p>
                                    <p>{referenceData.bulk.printing.find(p => p.printing_id === listing.collectedItem.printingId).printing_name}</p>
                                    <p>--</p> 
                                    <p>{listing.collectedItem.marketPrice}</p>
                                </div>
                            </div>
                        )}
                    </div>
                : <></>
            } />
            <Route path='/purchase' element={<PurchaseWatchedListing listing={listing} />}/>
            <Route path='/edit/*' element={<>
                {listing.id ? (
                    <EditWatchedListing listing={listing} referenceData={referenceData} setReferenceData={setReferenceData} />
                ) : (<>loading...</>)}
            </>} />            
        </Routes>
    )
}

export default Listing
