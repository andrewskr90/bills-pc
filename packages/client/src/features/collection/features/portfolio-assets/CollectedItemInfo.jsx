import React, { useEffect, useState } from 'react'
import PreviousRoutes from '../../../../layouts/previous-routes'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import BillsPcService from '../../../../api/bills-pc'

const CollectedItemInfo = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { id } = useParams()
    const [collectedItem, setCollectedItem] = useState()
    const [loadImage, setLoadImage] = useState(true)
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

    const handleSelectTransaction = (id) => {
        navigate(`/gym-leader/collection/assets/collected-item/${id}`)
    }

    return (
        <>
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
                    </div>
                </div>
                <div className='mt-4'>
                    <p className='font-bold'>Transactions</p>
                    {collectedItem.transactions.map(transaction => {
                        let transactionInfo = ''
                        const formattedDate = new Date(transaction.time).toLocaleDateString()
                        if (transaction.relisted) {
                            transactionInfo = `${transaction.lotId ? 'Lot r' : 'R'}elisted at ${transaction.price}`
                        } else if (transaction.saleId) {
                            transactionInfo = `$${transaction.price ? transaction.price : transaction.initialPrice} ${transaction.lotId ? 'lot ' : ''}purchased by ${transaction.purchaserName}`
                        } else if (transaction.importId) {
                            transactionInfo = `Imported by ${transaction.importerName}`
                        } else if (transaction.lotEditId) {
                            transactionInfo = transaction.lotInsertId ? 'Inserted in lot' : 'Removed from lot'
                        } else if (transaction.listingId) {
                            if (transaction.listingRemovalId) {
                                transactionInfo = `Listing removed`
                            } else {
                                if (!transaction.listingPriceId) {
                                    transactionInfo = `Listed ${transaction.lotId ? 'in lot ' : ''}for $${transaction.initialPrice}`
                                } else {
                                    transactionInfo = `${transaction.lotId ? 'Lot l' : 'L'}isting price updated to $${transaction.price}`
                                }
                            }
                        }
                        return <div className='flex justify-between items-center shadow-md rounded-sm mt-3 p-1'>
                            <div className='flex flex-col'>
                                <p className='my-0'>{formattedDate}</p>
                                <p className='my-0'>{transactionInfo}</p>
                            </div>
                            <button onClick={() => handleSelectTransaction(transaction)}>options</button>
                        </div>
                    })}
                </div>
            </div>}
        </>
    )
}

export default CollectedItemInfo
