import React, { useState } from 'react'
import BillsPcService from '../../../../api/bills-pc'
import { referenceData } from '../../../../../../service/middleware/QueueQueries'

const EditWatchedListing = (props) => {
    const { listing } = props
    const [updatedPrice, setUpdatedPrice] = useState(listing.listingPrice)

    const handleUpdatePrice = async () => {
        try {
            await BillsPcService.createListingPrice({ listingId: listing.id, price: updatedPrice })
        } catch (err) {
            console.log(err)
        }
    }
    return (listing ? <>
            <div>
                <p>Price</p>
                <input 
                    type="number" 
                    value={updatedPrice} 
                    onChange={(e) => setUpdatedPrice(e.target.value )} 
                />
                <button onClick={handleUpdatePrice}>Update Price</button>
            </div>
            {listing.lot.id && (
                <div style={{ paddingTop: '16px' }}>
                    <p>Lot</p>
                    {listing.lot.items.map(item => {
                        return (
                            <div>
                                <p>{item.name}</p>
                                <p>--</p>
                                <p>{referenceData.bulk.condition.find(c => c.condition_id === item.condition).condition_name}</p>
                            </div>
                        )
                    })}
                </div>
            )}
        </> : <>
            ...loading
        </>
    )
}
export default EditWatchedListing
