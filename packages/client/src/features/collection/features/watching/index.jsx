import React, { useEffect, useState } from 'react'
import { Route, Routes, useNavigate } from "react-router-dom"
import PlusButton from '../../../../components/buttons/plus-button/index.jsx'
import ImportListing from './ImportListing.jsx'
import BillsPcService from '../../../../api/bills-pc'
import Listing from './Listing.jsx'

const Listings = (props) => {
    const { referenceData, setReferenceData } = props
    const [listings, setListings] = useState(undefined)
    const navigate = useNavigate()
    useEffect(() => {
        (async () => {
            try {
                const listingsRes = await BillsPcService.getListings({ params: { watching: true }})
                setListings(listingsRes.data)
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
                        <div 
                            className='flex justify-center items-center w-full my-3'
                        >
                            <p className='mr-2'>Import Market Listing</p>
                            <PlusButton handleClick={() => navigate('import')} />
                        </div>
                        {listings ? (<>
                            {listings.length > 0 ? (<>
                                {listings.map(listing => {
                                    return (
                                        <div style={{ width: 'full', display: 'flex', alignItems: 'center' }}>
                                            <div>
                                                <p>{listing.listingTime}</p>
                                                <p>{listing.sellerName}</p>
                                                <p>${parseFloat(listing.updatedPrice ? listing.updatedPrice : listing.initialPrice)}</p>
                                                <p>
                                                    {listing.lot.id
                                                        ? 
                                                        `Item Lot` 
                                                        : 
                                                        listing.collectedItem.Id
                                                            ?
                                                            `Item`
                                                            :
                                                            `Bulk` 
                                                    }
                                                </p>
                                            </div>
                                            <button onClick={() => navigate(listing.id)}>Details</button>
                                        </div>
                                    )
                                })}
                            </>) : (
                                <>Create your first watched listing.</>
                            )}
                        </>) : (<>Loading...</>)}
                    </div>
                }
            />
            <Route 
                path="/import/*"
                element={<ImportListing 
                    referenceData={referenceData} 
                    setReferenceData={setReferenceData} 
                />}
            />
            <Route 
                path="/:id/*"
                element={<Listing 
                    referenceData={referenceData} 
                    setReferenceData={setReferenceData}
                />}
            />
        </Routes>
    )
}

export default Listings
