import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { initialListingValues } from '../../../../data/initialData'

const Listing = (props) => {
    const { listings } = props
    const [listing, setListing] = useState(initialListingValues)
    const { id } = useParams()
    useEffect(() => {
        if (listings.length > 0) {
            setListing(listings.find(listing => listing.id === id))
        }
    }, [listings])
    return (
        <div style={{ height: '100%', overflow: 'auto', marginBottom: '64px' }}>
            <p>{listing.date}</p>
            <p>{listing.sellerName}</p>
            <p>{listing.price}</p>
            {listing.lot.id && (
                <div>
                    <p>Listing Market Value: {listing.lot.items.reduce((a, c) => a + c.market_price_price, 0)}</p>
                    {listing.lot.items.map(item => {
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
    )
}

export default Listing
