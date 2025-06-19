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
                        setItemInfo(res.data.items[0])
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
                        src={`https://product-images.tcgplayer.com/fit-in/656x656/${itemInfo.tcgpId}.jpg`} 
                        onError={handleImageError} 
                    />
                    :
                    <p className='flex items-center h-[85%] w-[90%] bg-[#ececec] text-[12px] p-[2px] text-center rounded-[5px] m-1'>{itemInfo.name}</p>
                    }
                    <div className='w-2/3'>
                        <p className='font-bold text-lg'>{itemInfo.name}</p>
                        <p>{itemInfo.setName}</p>
                        <p>Quantity: {itemInfo.collectedItems.length}</p>
                    </div>
                </div>
                <div className='mt-4'>
                    <p className='font-bold'>Inventory</p>
                    {itemInfo.collectedItems.map(collectedItem => {
                        let formattedDate
                        let transactionType = ''
                        let purchasePrice
                        if (collectedItem.purchaseId) {
                            formattedDate = new Date(collectedItem.purchaseTime).toLocaleDateString()
                            if (collectedItem.lotId) transactionType = 'Purchased lot item'
                            else transactionType = 'Purchased single'
                            if (collectedItem.acceptedOfferPrice) purchasePrice = collectedItem.acceptedOfferPrice
                            else purchasePrice = collectedItem.purchasePrice
                        }
                        return <div className='flex justify-between items-center shadow-md rounded-sm mt-3 p-1'>
                            <div className='flex flex-col'>
                                <p className='my-0'>{formattedDate}</p>
                                <p className='my-0'>{transactionType}</p>
                            </div>
                            {purchasePrice && <p className='text-red'>-${purchasePrice}</p>}
                            <button onClick={() => handleSelectCollectedItem(collectedItem.collectedItemId)}>options</button>
                        </div>
                    })}
                </div>
            </div>}
        </>
    )
}

export default AssetItemInfo
