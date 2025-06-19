import React, { useEffect, useState } from 'react'
import PreviousRoutes from '../../../../layouts/previous-routes'
import { Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import BillsPcService from '../../../../api/bills-pc'
import { handleViewTransaction } from '../../utils/transaction'

const initialListingValues = { collectedItemId: undefined, description: undefined, time: undefined, price: undefined }
const initialAppraisalValues = { collectedItemId: undefined, time: undefined, conditionId: undefined }

const CollectedItemInfo = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { id } = useParams()
    const [collectedItem, setCollectedItem] = useState()
    const [conditions, setConditions] = useState([])
    const [loadImage, setLoadImage] = useState(true)
    const [listingValues, setListingValues] = useState({ ...initialListingValues, collectedItemId: id })
    const [appraisalValues, setAppraisalValues] = useState({ ...initialAppraisalValues, collectedItemId: id })
    const handleImageError = () => {
        setLoadImage(false)
    }

    useEffect(() => {
        (async () => {
            await BillsPcService.getConditions()
                .then(res => setConditions(res.data))
                .catch(err => console.log(err))
        })()
    }, [])

    useEffect(() => {
        (async () => {
            await BillsPcService.getCollectedItem({ id })
                .then(res => {
                    if (res.data.id) {
                        setCollectedItem(res.data)
                        setAppraisalValues({ ...appraisalValues, conditionId: res.data.appraisal.condition.id })
                    }
                })
                .catch(console.log)
        })()
    }, [id])

    const handleSelectTransaction = (transaction) => {
        handleViewTransaction(transaction.id, transaction.coreType, navigate)
    }

    const handleCreateListing = async (e) => {
        e.preventDefault()
        await BillsPcService.createListing({ data: listingValues })
            .then(res => {
                console.log(res)
            })
    }

    const handleCreateAppraisal = async (e) => {
        e.preventDefault()
        await BillsPcService.createAppraisal({ data: appraisalValues })
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
                                src={`https://product-images.tcgplayer.com/fit-in/656x656/${collectedItem.item.tcgpId}.jpg`} 
                                onError={handleImageError} 
                            />
                            :
                            <p className='flex items-center h-[85%] w-[90%] bg-[#ececec] text-[12px] p-[2px] text-center rounded-[5px] m-1'>{collectedItem.item.name}</p>
                            }
                            <div className='w-2/3'>
                                <p className='font-bold text-lg'>{collectedItem.item.name}</p>
                                <p>{collectedItem.item.setName}</p>
                                <p>{collectedItem.appraisal.condition.name} - {collectedItem.printing.name}</p>
                                {collectedItem.transactions[0].actions.map(action => {

                                    const { id, lotId, coreType } = collectedItem.transactions[0]
                                    let handleAction = () => {}
                                    if (action === 'View Listing') {
                                        handleAction = () => navigate(`/gym-leader/collection/listings/${id}`)
                                    } else if (action === 'View Lot') {
                                        handleAction = () => navigate(`/gym-leader/collection/assets/lot/${lotId}`)
                                    } else if(action === 'List') {
                                        handleAction = () => navigate('list')
                                    } else if(action === 'Gift') {

                                    } else if(action === 'Appraise') {
                                        handleAction = () => navigate('appraise')
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

            <Route
                path='/appraise'
                element={<>
                    <p>Appraise Collected Item</p>
                    <form>
                        <div>
                            <label style={{ display: 'flex', flexDirection: 'column' }}>
                                Time
                                <input type="datetime-local" value={appraisalValues.time} onChange={(e) => setAppraisalValues({ ...appraisalValues, time: e.target.value })} />
                            </label>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <label style={{ display: 'flex', flexDirection: 'column' }}>
                                Condition
                                <select value={appraisalValues.conditionId} onChange={(e) => setAppraisalValues({ ...appraisalValues, conditionId: e.target.value })}>
                                    {conditions.map(condition => <option value={condition.condition_id}>{condition.condition_name}</option>)}
                                </select>
                            </label>
                        </div>
                        <button onClick={handleCreateAppraisal}>create</button>
                    </form>
                </>}
            />
        </Routes>
    )
}

export default CollectedItemInfo
