import React, { useState } from 'react'
import BillsPcService from '../../../../api/bills-pc'
import EditSavedListingItem from './EditSavedListingItem'
import ListingItemToInsert from './ListingItemToInsert'
import { Route, Routes, useNavigate } from 'react-router-dom'
import SelectItems from '../../../../components/select-items'
import { convertLocalToUTC } from '../../../../utils/date'

const EditWatchedListing = (props) => {
    const { listing, referenceData, setReferenceData } = props
    const currentPrice = listing.listingPrices.length > 0 ? listing.listingPrices[0][1] : listing.initialPrice
    const [updatedPrice, setUpdatedPrice] = useState(currentPrice)
    const [insertedItems, setInsertedItems] = useState([])
    const [deletedCollectedItemIds, setDeletedCollectedItemIds] = useState([])
    const [timeOfPriceUpdate, setTimeOfPriceUpdate] = useState()
    const [timeOfUpdate, setTimeOfUpdate] = useState()
    const navigate = useNavigate()
    const handleUpdatePrice = async () => {
        try {
            const data = { listingId: listing.id, price: updatedPrice, time: convertLocalToUTC(timeOfPriceUpdate) }
            await BillsPcService.createListingPrice({ data })
                .then(res => {
                    console.log(res)
                    navigate('/gym-leader/collection/watching')
                })
                .catch(err => console.log(err))
        } catch (err) {
            console.log(err)
        }
    }
    const handleUpdateLot = async () => {
        try {
            const lotInserts = insertedItems.map(item => { 
                const { itemId, printingId, conditionId, note, index } = item
                return {
                    itemId, 
                    printingId, 
                    conditionId,
                    note,
                    index
                }
            })
            const { lot: { id: lotId } } = listing
            const lotRemovals = deletedCollectedItemIds.map(collectedItemId => ({ collectedItemId }))
            const data = { lotId, time: convertLocalToUTC(timeOfUpdate), lotInserts, lotRemovals }
            const params = { external: true }
            await BillsPcService.createLotEdit({ data, params })
        } catch (err) {
            console.log(err)
        }
    }
    const priceUpdateToBeHad = () => {
        if (updatedPrice && parseFloat(updatedPrice) !== parseFloat(currentPrice)) return true
        return false
    }
    const lotUpdateToBeHad = () => {
        if (
            deletedCollectedItemIds.length > 0 || 
            insertedItems.length > 0 ||
            deletedCollectedItemIds.length > 0
        ) return true
        return false
    }
    const handleSelectItems = (items) => {
        const maxIndex = listing.lot.items.reduce((prev, cur) => {
            if (cur.index > prev) return cur.index
            return prev
        }, 0)
        setInsertedItems([
            ...insertedItems,
            ...items.map((item, idx) => ({ 
                name: item.name,
                itemId: item.id, 
                printingId: item.printing,
                conditionId: item.sealed 
                    ? referenceData.bulk.condition.find(cond => cond.condition_name === 'Unopened').condition_id 
                    : referenceData.bulk.condition.find(cond => cond.condition_name === 'Near Mint').condition_id,
                sealed: item.sealed,
                index: maxIndex+ 1 + idx,
                note: ''

            }))
        ])
        navigate(-1)
    }

    return (
        <Routes>
            <Route path='/' element={
                listing ? <div className='pb-20'>
                    <div>
                        <p>Price</p>
                        <label style={{ display: 'flex', flexDirection: 'column' }}>
                            Time of update
                            <input type="datetime-local" value={timeOfPriceUpdate} onChange={(e) => setTimeOfPriceUpdate(e.target.value)} />
                        </label>
                        <input 
                            type="number" 
                            value={updatedPrice} 
                            onChange={(e) => setUpdatedPrice(e.target.value )} 
                            className="border-black border-solid border-2"
                        />
                        {priceUpdateToBeHad() && <button onClick={handleUpdatePrice}>Update Price</button>}
                    </div>
                    {listing.lot.id && (
                        <div style={{ paddingTop: '16px' }}>
                            <div className="flex">
                                <p>Lot</p>
                                <button onClick={() => navigate('add-lot')}>Add Items</button>
                                {lotUpdateToBeHad() && <div>
                                    <label style={{ display: 'flex', flexDirection: 'column' }}>
                                        Time of update
                                        <input type="datetime-local" value={timeOfUpdate} onChange={(e) => setTimeOfUpdate(e.target.value)} />
                                    </label>
                                    <button onClick={handleUpdateLot} >Update Lot</button>
                                </div>}
                            </div>
                            {listing.lot.items.map(item => <EditSavedListingItem item={item} referenceData={referenceData} deletedCollectedItemIds={deletedCollectedItemIds} setDeletedCollectedItemIds={setDeletedCollectedItemIds} />)}
                        </div>
                    )}
                    {insertedItems.map((item, idx) => <ListingItemToInsert 
                        item={item} 
                        idx={idx}
                        referenceData={referenceData} 
                        insertedItems={insertedItems} 
                        setInsertedItems={setInsertedItems}
                    />)}
                </div> : <>
                    ...loading
                </>
            } />
                <Route 
                path='/add-lot/*'
                element={<SelectItems
                    referenceData={referenceData}
                    setReferenceData={setReferenceData}
                    handleSelectItems={handleSelectItems}
                    initialEmptyMessage={"Search for items to add to lot."}
                />}
            />
        </Routes>
    )
}
export default EditWatchedListing
