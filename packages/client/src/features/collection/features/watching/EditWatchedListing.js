import React, { useState } from 'react'
import BillsPcService from '../../../../api/bills-pc'

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
            <p>Price</p>
            <input 
                type="number" 
                value={updatedPrice} 
                onChange={(e) => setUpdatedPrice(e.target.value )} 
            />
            <button onClick={handleUpdatePrice}>Update Price</button>
            {/* edit lot */}
        </> : <>
            ...loading
        </>
    )
}
export default EditWatchedListing
