import React, { useState } from "react"
import { Route, Routes, useNavigate } from "react-router-dom"
import BillsPcService from "../../../../api/bills-pc"
import { initialExternalListing, initialSortingSplitValues } from "../../../../data/initialData"
import BulkEditor from "../../../../components/bulk-editor/index.jsx"
import editPNG from '../../assets/edit.png'
import EditListingItem from './EditListingItem.jsx'
import SelectItems from "../../../../components/select-items/index.jsx"
import SearchAndSelect from "../../../../components/search-and-select/index.jsx"

const ImportListing = (props) => {
    const { referenceData, setReferenceData } = props
    const [externalListing, setExternalListing] = useState(initialExternalListing)
    const [createdProxyUsers, setCreatedProxyUsers] = useState([])
    const navigate = useNavigate()
    const initialEmptyMessage = "Select item to import"
    const initialEmptyItemsMessage = "Select items to import"
    const [vendorName, setVendorName] = useState("")
    const [timeoutId, setTimeoutId] = useState()
    
    const handleChangeVendorName = (e) => {
        clearTimeout(timeoutId)
        setVendorName(e.target.value)
        setTimeoutId(setTimeout(async () => {
            const params = { proxy: true, user_name: e.target.value }
            await BillsPcService.getUsers({ params })
                .then(res => setCreatedProxyUsers(res.data.users))
                .catch(err => console.log(err))
        }, 500))
    }

    const handleSelectVendor = ((selectedProxyUser) => {
        setExternalListing({
            ...externalListing,
            sellerId: selectedProxyUser.user_id
        })
    })

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
        navigate('/gym-leader/collection/listings/import')
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
        navigate('/gym-leader/collection/listings/import')
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
                    navigate('/gym-leader/collection/listings')
                })
                .catch(err => console.log(err))
        } catch (err) {
            console.log(err)
        }
    }

    const createNewProxyUser = async (newProxyUser) => {
        try {
            const { data: { id } } = await BillsPcService.postUser({ data: { user_name: newProxyUser }, params: { proxy: true } })
            setCreatedProxyUsers([...createdProxyUsers, { user_name: newProxyUser, user_id: id }])
            setExternalListing({ ...externalListing, sellerId: id })
        } catch (err) {
            console.log(err)
        }
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
        navigate('/gym-leader/collection/listings/import')
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
        navigate('/gym-leader/collection/listings/import')
    }

    const handleChange = (e, idx) => {
        setExternalListing({
            ...externalListing,
            items: externalListing.items.map((item, idxToUpdate) => {
                if (parseInt(idx) === idxToUpdate) {
                    return {
                        ...item,
                        [e.target.name]: e.target.value
                    }
                } else {
                    return item
                }
            })
        })
    }

    const { condition } = referenceData.bulk
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
                            <SearchAndSelect
                                selected={createdProxyUsers.find(user => user.user_id === externalListing.sellerId)}
                                value={vendorName}
                                handleChange={handleChangeVendorName}
                                searched={createdProxyUsers}
                                displayKey='user_name'
                                handleSelect={handleSelectVendor}
                                label='Vendor'
                                handleCreateNew={createNewProxyUser}
                                createNewText="Create New Seller"
                            />
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
                                <div style={{ display: 'flex ', alignItems: 'start', width: '90%' }}>
                                    <img 
                                        className="w-1/5"
                                        src={`https://product-images.tcgplayer.com/fit-in/656x656/${item.tcgpId}.jpg`} 
                                    />
                                    <div className="flex flex-col w-4/5">
                                        <p>{item.name}</p>
                                        <p>{item.set.name}</p>
                                        <select name='condition' onChange={(e) => handleChange(e, idx)} value={item.condition}>
                                            {item.sealed ? <>
                                                <option value={'7e464ec6-0b23-11ef-b8b9-0efd996651a9'}>{condition.find(c => c.condition_id === '7e464ec6-0b23-11ef-b8b9-0efd996651a9').condition_name}</option>
                                            </> : <>
                                                {condition.filter(c => c.condition_id !== '7e464ec6-0b23-11ef-b8b9-0efd996651a9').map(c => {
                                                    return <option value={c.condition_id}>{c.condition_name}</option>
                                                })}
                                            </>}
                                        </select>
                                        <select name='printing' onChange={(e) => handleChange(e, idx)} value={item.printing}>
                                            {item.printings.map(p => {
                                                return <option value={p.id}>{p.name}</option>
                                            })}
                                        </select>
                                        <button onClick={() => handleEditItem('item', idx)}>Add Note</button>
                                    </div>
                                </div>
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
                    listing={externalListing}
                    setListing={setExternalListing}
                    handleChange={handleChange}
                />}
            />
        </Routes>
}

export default ImportListing
