import React, { useEffect, useState } from 'react'
import { Route, Routes, useNavigate } from "react-router-dom"
import PlusButton from '../../../../components/buttons/plus-button'
import ImportListing from './ImportListing'
import BillsPcService from '../../../../api/bills-pc'
import Listing from './Listing'

const Watching = (props) => {
    const { referenceData, setReferenceData, createdProxyUsers, setCreatedProxyUsers } = props
    const [watching, setWatching] = useState([])
    const navigate = useNavigate()
    useEffect(() => {
        (async () => {
            try {
                const watchingResults = await BillsPcService.getListings({ params: { watching: true }})
                setWatching(watchingResults.data)
            } catch (err) {
                console.log(err)
            }
        })()
    }, [])
    return (
        <Routes>
            <Route 
                path='/'
                element={
                    <div style={{ height: '100%', width: 'full', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingBottom: '80px' }}>
                        <p>Import External Listing</p>
                        <PlusButton handleClick={() => navigate('import')} />
                        {watching.map(listing => {
                            return (
                                <div style={{ width: 'full', display: 'flex', alignItems: 'center' }}>
                                    <div>
                                        <p>{listing.date}</p>
                                        <p>{listing.sellerName}</p>
                                        <p>${listing.price}</p>
                                        <p>
                                            {listing.lot.id 
                                            ? 
                                            `${listing.lot.items.length} Item Lot` 
                                            : 
                                            listing.collectedCard.id 
                                                ? 
                                                listing.collectedCard.card_v2_name
                                                : 
                                                listing.collectedProduct.product_name
                                            }
                                        </p>
                                    </div>
                                    <button onClick={() => navigate(listing.id)}>Details</button>
                                </div>
                            )
                        })}
                    </div>
                }
            />
            <Route 
                path="/import/*"
                element={<ImportListing 
                    createdProxyUsers={createdProxyUsers}
                    setCreatedProxyUsers={setCreatedProxyUsers}
                    referenceData={referenceData} 
                    setReferenceData={setReferenceData} 
                />}
            />
            <Route 
                path="/:id/*"
                element={<Listing 
                    referenceData={referenceData} 
                    setReferenceData={setReferenceData}
                    listings={watching}
                />}
            />
        </Routes>
    )
}

export default Watching
