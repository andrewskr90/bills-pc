import React, { useState } from 'react'

const CollectedItem = (props) => {
    const { collectedItem, handleSelectItem } = props
    const [loadImage, setLoadImage] = useState(true)
    const handleImageError = () => {
        setLoadImage(false)
    }
    return (
        <div className='mb-2 flex flex-col rounded-sm w-[44%] max-w-48'>
        <div className='flex h-32'>
            <div className='flex justify-center items-center w-3/5 h-full'>
                {loadImage 
                ?
                <img 
                    className='max-h-[95%] max-w-[90%] rounded-lg'
                    src={`https://product-images.tcgplayer.com/fit-in/656x656/${collectedItem.tcgpId}.jpg`} 
                    onError={handleImageError} 
                />
                :
                <p className='flex items-center h-[85%] w-[90%] bg-[#ececec] text-[12px] p-[2px] text-center rounded-[5px] m-1'>{collectedItem.name}</p>
                }
            </div>
            <div className='text-blue mt-1 w-2/5 h-[90%] flex flex-col justify-center items-center'>
                <p>x {collectedItem.quantity}</p>
                <button className='rounded-full border-blue bb-white border-2 w-1/2' style={{ borderRadius: '50%', backgroundColor: 'white', color: '#6065cb', borderColor: '#6065cb' }} onClick={() => handleSelectItem(collectedItem.itemId)}>i</button>
            </div>
        </div>
    </div>)
}

export default CollectedItem
