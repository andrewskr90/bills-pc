import React, { useEffect, useState } from 'react'
import PreviousRoutes from '../../../../layouts/previous-routes'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import BillsPcService from '../../../../api/bills-pc'

const AssetItemInfo = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { itemId } = useParams()
    const [itemInfo, setItemInfo] = useState()
    const [loadImage, setLoadImage] = useState(true)
    const handleImageError = () => {
        setLoadImage(false)
    }

    useEffect(() => {
        (async () => {
            await BillsPcService.getPortfolio({ itemId })
                .then(res => {
                    if (res.data.items.length > 0) {
                        setItemInfo(res.data)
                    } else {
                        navigate('/gym-leader/collection/assets')
                    }
                })
                .catch(console.log)
        })()
    }, [itemId])

    const handleSelectCollectedItem = (id) => {
        navigate(`/gym-leader/collection/assets/collected-item/${id}`)
    }

    return (
        <>
            <PreviousRoutes location={location} />
            {itemInfo && <div className='flex flex-col items-center'>
                <div className='flex'>
                    {loadImage 
                    ?
                    <img 
                        className='w-1/3 rounded-lg mx-4'
                        src={`https://product-images.tcgplayer.com/fit-in/656x656/${itemInfo.items[0].item.tcgpId}.jpg`} 
                        onError={handleImageError} 
                    />
                    :
                    <p className='flex items-center h-[85%] w-[90%] bg-[#ececec] text-[12px] p-[2px] text-center rounded-[5px] m-1'>{itemInfo.items[0].item.name}</p>
                    }
                    <div className='w-2/3'>
                        <p className='font-bold text-lg'>{itemInfo.items[0].item.name}</p>
                        <p>{itemInfo.items[0].item.setName}</p>
                        <p>Quantity: {itemInfo.count}</p>
                    </div>
                </div>
                <div className='mt-4'>
                    <p className='font-bold'>Inventory</p>
                    {itemInfo.items.map(collectedItem => {
                        let formattedDate
                        let transactionType = ''
                        let purchasePrice
                        if (collectedItem.credit.sale.id) {
                            formattedDate = new Date(collectedItem.credit.sale.time).toLocaleDateString()
                            if (collectedItem.credit.lot.id) transactionType = 'Purchased lot item'
                            else transactionType = 'Purchased single'
                            // TODO add accepted offers in credit info
                            // if (collectedItem.acceptedOfferPrice) purchasePrice = collectedItem.acceptedOfferPrice
                            // else purchasePrice = collectedItem.purchasePrice
                            purchasePrice = collectedItem.credit.listing.updatedPrice.id ? collectedItem.credit.listing.updatedPrice.price : collectedItem.credit.listing.price
                        }
                        return <div className='flex justify-between items-center shadow-md rounded-sm mt-3 p-1'>
                            <div className='flex flex-col'>
                                <p className='my-0'>{formattedDate}</p>
                                <p className='my-0'>{transactionType}</p>
                            </div>
                            {purchasePrice && <p className='text-red'>-${purchasePrice}</p>}
                            <button onClick={() => handleSelectCollectedItem(collectedItem.id)}>options</button>
                        </div>
                    })}
                </div>
            </div>}
        </>
    )
}

export default AssetItemInfo
