import React, { useState } from "react"
import { Route, Routes, useNavigate } from "react-router-dom"
import BillsPcService from "../../../../api/bills-pc"
import { initialExternalListing, initialSortingSplitValues } from "../../../../data/initialData"
import BulkEditor from "../../../../components/bulk-editor/index.jsx"
import editPNG from '../../assets/edit.png'
import EditListingItem from './EditListingItem.jsx'
import InputSelect from "../../../../components/input-select/index.jsx"
import SelectItems from "../../../../components/select-items/index.jsx"

const ImportListing = (props) => {
    const { referenceData, setReferenceData, createdProxyUsers, setCreatedProxyUsers } = props
    const [externalListing, setExternalListing] = useState(initialExternalListing)
    const navigate = useNavigate()
    const initialEmptyMessage = "Select item to import"
    const initialEmptyItemsMessage = "Select items to import"
    const handleSelectItem = (item) => {
        setExternalListing({
            ...externalListing,
            items: [
                ...externalListing.items,
                {
                    ...item,
                    note: ''
                }
            ]
        })
        navigate('/gym-leader/collection/watching/import')
    }
    const handleSelectItems = (items) => {
        setExternalListing({
            ...externalListing,
            items: items.map(item => ({ 
                ...item, note: '', 
                condition: item.sealed 
                    ? referenceData.bulk.condition.find(cond => cond.condition_name === 'Unopened').condition_id 
                    : referenceData.bulk.condition.find(cond => cond.condition_name === 'Near Mint').condition_id,
                printing: item.printing
            }))
        })
        navigate('/gym-leader/collection/watching/import')
    }

    const formatExternalListing = (listing) => {
        return {
            ...listing,
            time: new Date(listing.time).toISOString(),
            items: listing.items.map(item => { 
                const { id, printing, condition, note } = item
                return {
                    id, 
                    printing,
                    condition,
                    note
                }
            }),
        }
    }
    const handleCreateExternalListing = async () => {   
        try {
            
            await BillsPcService.postListing({ data: formatExternalListing(externalListing), params: { external: true } })
                .then(res => {
                    console.log(res)
                    navigate('/gym-leader/collection/watching')
                })
                .catch(err => console.log(err))
        } catch (err) {
            console.log(err)
        }
    }

    const createNewProxyUser = async (newProxyUser) => {
        try {
            const { data: { id } } = await BillsPcService.postUser({ data: newProxyUser, params: { proxy: true } })
            setCreatedProxyUsers([...createdProxyUsers, { ...newProxyUser, user_id: id }])
            setExternalListing({ ...externalListing, sellerId: id })
        } catch (err) {

        }
    }

    const ProxyUserSelector = () => {
        return (
            externalListing.sellerId ? (
                <p>{createdProxyUsers.find(user => user.user_id === externalListing.sellerId).user_name}</p>
                ) : (
                <InputSelect 
                    searchKey="user_name" 
                    items={createdProxyUsers} 
                    handleSelect={((selectedProxyUser) => {
                        setExternalListing({
                            ...externalListing,
                            sellerId: selectedProxyUser.user_id
                        })

                    })} 
                    handleCreateNew={(user_name => createNewProxyUser({ user_name }))}
                    createNewText="Create New Seller"
                />
            )
        )
    }
    const addSplitToTransaction = (splitToAdd) => {
        setExternalListing({
            ...externalListing,
            bulkSplits: [
                ...externalListing.bulkSplits,
                {
                    ...splitToAdd,
                    note: ''
                }
            ]
        })
        navigate('/gym-leader/collection/watching/import')
    }
    const handleEditItem = (itemType, idx) => {
        navigate(`edit/${itemType}/${idx}`)
    }

    const updateSplitInBulkValues = (updatedSplit, updatedIdx) => {
        const adjustedSplits = externalListing.bulkSplits.map((split, i) => {
            if (i=== parseInt(updatedIdx)) return updatedSplit
            return split
        })
        setExternalListing({
            ...externalListing,
            bulkSplits: adjustedSplits
        })
        navigate('/gym-leader/collection/watching/import')
    }
    
    return <Routes>
            <Route
                path="/"
                element={
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        overflow: 'auto',
                        paddingBottom: '128px'
                    }}>
                        <p>External Listing</p>
                        <div style={{ display: 'flex' }}>
                            <label style={{ display: 'flex', flexDirection: 'column' }}>
                                Time
                                <input type="datetime-local" value={externalListing.time} onChange={(e) => setExternalListing({ ...externalListing, time: e.target.value })} />
                            </label>
                            <label style={{ display: 'flex', flexDirection: 'column' }}>
                                Seller
                                <ProxyUserSelector />
                            </label>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <label style={{ display: 'flex', flexDirection: 'column' }}>
                                Price
                                <input type="number" value={externalListing.price} onChange={(e) => setExternalListing({ ...externalListing, price: e.target.value })} />
                            </label>
                        </div>
                        <label style={{ display: 'flex', flexDirection: 'column' }}>
                            Description
                            <textarea type='text' value={externalListing.description} onChange={(e) => setExternalListing({ ...externalListing, description: e.target.value })}/>
                        </label>

                        {externalListing.items.length + 
                        externalListing.bulkSplits.length > 1  ? (
                            <p>Lot Items</p> 
                        ) : (
                            <p>Item</p>
                        )}
                        {externalListing.items.map((item, idx) => {
                            return (<div style={{ display: 'flex ', width: '100%', justifyContent: 'space-around', paddingBottom: '4px' }}>
                                <div style={{ display: 'flex ', alignItems: 'start', flexDirection: 'column', width: '90%' }}>
                                    {item.name}
                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start' }}>
                                        <p>{referenceData.bulk.condition.find(c => c.condition_id === item.condition).condition_name}</p>
                                        <p>--</p>
                                        <p>{referenceData.bulk.printing.find(p => p.printing_id === item.printing).printing_name}</p>
                                    </div>
                                </div>
                                <img src={editPNG} onClick={() => handleEditItem('item', idx)} />
                            </div>)
                        })}
                        {externalListing.bulkSplits.map((split, idx) => {
                            return (<div style={{ display: 'flex ', width: '100%', justifyContent: 'space-around' }}>
                                <p>{`Bulk: ${split.estimate ? '~' : ''}${split.count} cards`}</p>
                                <img src={editPNG} onClick={() => handleEditItem('bulkSplit', idx)} />
                            </div>)
                        })}
                        <div style={{ display: 'flex' }}>
                            <button onClick={() => navigate('add-bulk')}>Add Bulk</button>
                            <button onClick={() => navigate('add-lot')}>Add Lot</button>
                        </div>
                        <button onClick={handleCreateExternalListing}>Create Listing</button>
                    </div>
                }
            />
            <Route 
                path='/add-bulk'
                element={<BulkEditor 
                    referenceData={referenceData}
                    addSplitToTransaction={addSplitToTransaction}
                    initialSplitValues={initialSortingSplitValues} 
                />}
            />
            <Route 
                path='/add-lot/*'
                element={<SelectItems
                    referenceData={referenceData}
                    setReferenceData={setReferenceData}
                    handleSelectItems={handleSelectItems}
                    initialEmptyMessage={initialEmptyItemsMessage}
                />}
            />
            <Route 
                path='/edit/bulkSplit/:idx'
                element={<BulkEditor 
                    referenceData={referenceData}
                    updateSplitInBulkValues={updateSplitInBulkValues}
                    purchaseValues={externalListing}
                    initialSplitValues={initialSortingSplitValues}
                />}
            />
            <Route 
                path='/edit/:itemType/:idx'
                element={<EditListingItem 
                    referenceData={referenceData}
                    listing={externalListing}
                    setListing={setExternalListing}
                />}
            />
        </Routes>
}

export default ImportListing
