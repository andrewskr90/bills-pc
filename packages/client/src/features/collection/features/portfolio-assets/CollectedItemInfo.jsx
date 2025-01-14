import React, { useEffect, useState } from 'react'
import PreviousRoutes from '../../../../layouts/previous-routes'
import { Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import BillsPcService from '../../../../api/bills-pc'

const initialListingValues = { collectedItemId: undefined, description: undefined, time: undefined, price: undefined }

const CollectedItemInfo = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { id } = useParams()
    const [collectedItem, setCollectedItem] = useState()
    const [loadImage, setLoadImage] = useState(true)
    const [listingValues, setListingValues] = useState({ ...initialListingValues, collectedItemId: id })
    const handleImageError = () => {
        setLoadImage(false)
    }

    useEffect(() => {
        (async () => {
            await BillsPcService.getCollectedItem({ id })
                .then(res => {
                    if (res.data.collectedItemId) {
                        setCollectedItem(res.data)
                    }
                })
                .catch(console.log)
        })()
    }, [id])

    const handleSelectTransaction = (transaction) => {
        
    }

    const handleCreateListing = async (e) => {
        e.preventDefault()
        await BillsPcService.createListing({ data: listingValues })
            .then(res => {
                console.log(res)
            })
    }

    return (
        <Routes>
            <Route 
                path='/'
                element={<>
                    <PreviousRoutes location={location} />
                    {collectedItem && <div className='flex flex-col items-center'>
                        <div className='flex'>
                            {loadImage 
                            ?
                            <img 
                                className='w-1/3 rounded-lg mx-4'
                                src={`https://product-images.tcgplayer.com/fit-in/656x656/${collectedItem.tcgpId}.jpg`} 
                                onError={handleImageError} 
                            />
                            :
                            <p className='flex items-center h-[85%] w-[90%] bg-[#ececec] text-[12px] p-[2px] text-center rounded-[5px] m-1'>{collectedItem.name}</p>
                            }
                            <div className='w-2/3'>
                                <p className='font-bold text-lg'>{collectedItem.name}</p>
                                <p>{collectedItem.setName}</p>
                                <p>{collectedItem.conditionName} - {collectedItem.printingName}</p>
                                {collectedItem.transactions[0].actions.map(action => {
                                    let handleAction = () => {}
                                    
                                    if (action === 'View Listing') {
                                        const { listingId } = collectedItem.transactions[0]
                                        handleAction = () => navigate(`/gym-leader/collection/transactions/listing/${listingId}`)
                                    } else if (action === 'Remove from lot') {
                                        
                                    } else if(action === 'List') {
                                        handleAction = () => navigate('list')
                                    } else if(action === 'Gift') {

                                    } else if(action === 'Update Price') {

                                    } else if(action === 'Remove Listing') {

                                    } else if(action === 'Record Sale') {

                                    }
                                    return <button onClick={handleAction}>{action}</button>
                                })}
                            </div>
                        </div>
                        <div className='mt-4'>
                            <p className='font-bold'>Transactions</p>
                            {collectedItem.transactions.map(transaction => {
                                const formattedDate = new Date(transaction.time).toLocaleDateString()
                                
                                return <div className='flex justify-between items-center shadow-md rounded-sm mt-3 p-1'>
                                    <div className='flex flex-col'>
                                        <p className='my-0'>{formattedDate}</p>
                                        <p className='my-0'>{transaction.transactionInfo}</p>
                                    </div>
                                    <button onClick={() => handleSelectTransaction(transaction)}>options</button>
                                </div>
                            })}
                        </div>
                    </div>}
                </>} 
            />
            <Route
                path='/list'
                element={<>
                    <p>List Collected Item</p>
                    <form>
                        <div>
                            <label style={{ display: 'flex', flexDirection: 'column' }}>
                                Time
                                <input type="datetime-local" value={listingValues.time} onChange={(e) => setListingValues({ ...listingValues, time: e.target.value })} />
                            </label>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <label style={{ display: 'flex', flexDirection: 'column' }}>
                                Price
                                <input type="number" value={listingValues.price} onChange={(e) => setListingValues({ ...listingValues, price: e.target.value })} />
                            </label>
                        </div>
                        <label style={{ display: 'flex', flexDirection: 'column' }}>
                            Description
                            <textarea type='text' value={listingValues.description} onChange={(e) => setListingValues({ ...listingValues, description: e.target.value })}/>
                        </label>
                        <button onClick={handleCreateListing}>create</button>
                    </form>
                </>}
            />
        </Routes>
    )
}

export default CollectedItemInfo
