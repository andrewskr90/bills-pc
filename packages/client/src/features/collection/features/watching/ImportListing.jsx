import React, { useEffect, useState } from "react"
import { Route, Routes, useNavigate } from "react-router-dom"
import BillsPcService from "../../../../api/bills-pc"
import { initialExternalListing, initialSortingSplitValues } from "../../../../data/initialData"
import BulkEditor from "../../../../components/bulk-editor/index.jsx"
import editPNG from '../../assets/edit.png'
import EditListingItem from './EditListingItem.jsx'
import InputSelect from "../../../../components/input-select/index.jsx"
import SelectItems from "../../../../components/select-items/index.jsx"

const dummyItems = [
    {
        "id": "a299cba6-6d75-4783-96ff-15cbe4acac43",
        "name": "Slakoth",
        "tcgpId": 89300,
        "printings": [
            {
                "id": "195da59e-fead-11ee-b8b9-0efd996651a9",
                "name": "Normal"
            },
            {
                "id": "2d1c5aa8-fead-11ee-b8b9-0efd996651a9",
                "name": "Reverse Holofoil"
            }
        ],
        "set": {
            "id": "ba1774be-facb-4b18-a9ed-7111f553a2f2",
            "name": "Dragons Exalted",
            "series": "Black & White",
            "release_date": "2012-08-15T14:00:00.000Z",
            "ptcgio_id": "bw6"
        },
        "count": {
            "195da59e-fead-11ee-b8b9-0efd996651a9": 1
        },
        "activePrinting": "195da59e-fead-11ee-b8b9-0efd996651a9",
        "printing": "195da59e-fead-11ee-b8b9-0efd996651a9",
        "note": "",
        "condition": "0655c457-ff60-11ee-b8b9-0efd996651a9"
    },
    {
        "id": "b74da95f-98ae-4cad-b079-40b416c6f224",
        "name": "Slakoth",
        "tcgpId": 89298,
        "printings": [
            {
                "id": "195da59e-fead-11ee-b8b9-0efd996651a9",
                "name": "Normal"
            },
            {
                "id": "2d1c5aa8-fead-11ee-b8b9-0efd996651a9",
                "name": "Reverse Holofoil"
            }
        ],
        "set": {
            "id": "8c525cfa-90af-4b0b-977d-8baf62355513",
            "name": "Mysterious Treasures",
            "series": "Diamond & Pearl",
            "release_date": "2007-08-01T14:00:00.000Z",
            "ptcgio_id": "dp2"
        },
        "count": {
            "195da59e-fead-11ee-b8b9-0efd996651a9": 1
        },
        "activePrinting": "195da59e-fead-11ee-b8b9-0efd996651a9",
        "printing": "195da59e-fead-11ee-b8b9-0efd996651a9",
        "note": "",
        "condition": "0655c457-ff60-11ee-b8b9-0efd996651a9"
    },
    {
        "id": "dde46d43-7b66-4c87-9714-c012f9ab5fa6",
        "name": "Slakoth",
        "tcgpId": 89297,
        "printings": [
            {
                "id": "195da59e-fead-11ee-b8b9-0efd996651a9",
                "name": "Normal"
            },
            {
                "id": "2d1c5aa8-fead-11ee-b8b9-0efd996651a9",
                "name": "Reverse Holofoil"
            }
        ],
        "set": {
            "id": "7c10f246-686e-4c58-8a24-4d5c18e10414",
            "name": "Power Keepers",
            "series": "EX",
            "release_date": "2007-02-02T16:00:00.000Z",
            "ptcgio_id": "ex16"
        },
        "activePrinting": "2d1c5aa8-fead-11ee-b8b9-0efd996651a9",
        "count": {
            "2d1c5aa8-fead-11ee-b8b9-0efd996651a9": 1
        },
        "printing": "2d1c5aa8-fead-11ee-b8b9-0efd996651a9",
        "note": "",
        "condition": "0655c457-ff60-11ee-b8b9-0efd996651a9"
    }
]

const ImportListing = (props) => {
    const { referenceData, setReferenceData } = props
    const [externalListing, setExternalListing] = useState(initialExternalListing)
    const [createdProxyUsers, setCreatedProxyUsers] = useState([])
    const navigate = useNavigate()
    const initialEmptyMessage = "Select item to import"
    const initialEmptyItemsMessage = "Select items to import"

    useEffect(() => {
        (async () => { 
            await BillsPcService.getUsers({ params: { proxy: true } })
                .then(res => setCreatedProxyUsers(res.data))
                .catch(err => console.log(err))
        })()
    }, [])

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
            const { data: { id } } = await BillsPcService.postUser({ data: newProxyUser, params: { proxy: true } })
            setCreatedProxyUsers([...createdProxyUsers, { ...newProxyUser, user_id: id }])
            setExternalListing({ ...externalListing, sellerId: id })
        } catch (err) {
            console.log(err)
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
