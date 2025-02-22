import React, { useEffect, useState } from 'react'
import BillsPcService from '../../../../api/bills-pc'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import CollectedItem from '../../../../components/collected-item'
import PageSelection from '../../../../components/page-selection'
import { buildParams } from '../../../../utils/location'

const LotInfo = () => {
    const [lot, setLot] = useState()
    const [itemsOrEdits, setItemsOrEdits] = useState('items')
    const [error, setError] = useState()
    const { id } = useParams()
    const [loadImage, setLoadImage] = useState(true)
    const navigate = useNavigate()
    const location = useLocation()
    const handleImageError = () => {
        setLoadImage(false)
    }
    const handleSelectItem = (id) => {
        navigate(`/gym-leader/collection/assets/collected-item/${id}`)
    }

    useEffect(() => {
        (async () => {
            const params = buildParams(location)
            params.direction = params.direction ? params.direction : undefined
            await BillsPcService.getLotById(id, params)
                .then(res => {
                    setLot(res.data)
                }).catch(err => setError(err.response.data.message))
        })()
    }, [location.search])
    
    return <div className='flex flex-col items-start'>
        <p>Lot Info</p>
        {lot ? <>
            <p>{lot.acquisition.description}</p>
            <PageSelection location={location} count={lot.count} />
            <div className='flex flex-wrap mb-20'>
                {lot.items.map(item => {
                    return <div className='mb-2 flex flex-col rounded-sm w-[100%]'>
                        <div className='flex h-40'>
                            <div className='flex justify-center items-center w-1/4 h-full'>
                                {loadImage 
                                ?
                                <img 
                                    className='max-h-[95%] max-w-[90%] rounded-lg'
                                    src={`https://product-images.tcgplayer.com/fit-in/656x656/${item.tcgpId}.jpg`} 
                                    onError={handleImageError} 
                                />
                                :
                                <p className='flex items-center h-[85%] w-[90%] bg-[#ececec] text-[12px] p-[2px] text-center rounded-[5px] m-1'>{item.name}</p>
                                }
                            </div>
                            <div className='mt-1 w-2/5 h-[90%] flex flex-col justify-center items-start'>
                                <p>{item.conditionName} - {item.printingName}</p>
                                <p>{item.name}</p>
                                <p>{item.setName}</p>
                                <button onClick={() => handleSelectItem(item.collectedItemId)}>View</button>
                            </div>
                        </div>
                    </div>
                })}
                <PageSelection location={location} count={lot.count} />
            </div>
        </> : error ? <>
            <p>{error}</p> 
        </> : <>
            <p>loading...</p>
        </>}
    </div>
}

export default LotInfo
