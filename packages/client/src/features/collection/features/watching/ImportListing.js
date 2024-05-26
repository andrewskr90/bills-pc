import React, { useEffect, useState } from "react"
import { Route, Routes, useNavigate } from "react-router-dom"
import SelectItem from "../../../../components/select-item"
import BillsPcService from "../../../../api/bills-pc"
import { initialExternalListing, initialSortingSplitValues } from "../../../../data/initialData"
import BulkEditor from "../../../../components/bulk-editor"
import editPNG from '../../assets/edit.png'
import EditListingItem from './EditListingItem'
import InputSelect from "../../../../components/input-select"
import SelectItems from "../../../../components/select-items"
import { getSkusBillsPc } from "../../../../../../scrapers/api"

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
        // item selector will need to include printing and condition options
        // creating listing, items can either have bpc or tcgp ids. csv will use tcgp
        // or should the front end fetch bpc ids, probably this. api call that only sends the csv
        // and responds with an array formatted just like `add lot to purchase`
        // this will deprecate the cards_v2 and products tables, I should possibly create a new user
        // and reformat my kyle user data later. full date time transactions should be created too.
        setExternalListing({
            ...externalListing,
            items: items.map(item => ({ ...item, note: '', printing: undefined, condition: undefined }))
        })
        navigate('/gym-leader/collection/watching/import')
    }

    const handleCreateExternalListing = async () => {
        try {
            await BillsPcService.postListing({ data: externalListing, params: { external: true } })
            navigate('/gym-leader/collection/watching/import')
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
                        console.log(selectedProxyUser)
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
                                Date
                                <input type="date" value={externalListing.date} onChange={(e) => setExternalListing({ ...externalListing, date: e.target.value })} />
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
                            return (<div style={{ display: 'flex ', width: '100%', justifyContent: 'space-around' }}>
                                {item.name}
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
                            <button onClick={() => navigate('add-item')}>Add Item</button>
                            <button onClick={() => navigate('add-bulk')}>Add Bulk</button>
                            <button onClick={() => navigate('add-lot')}>Add Lot</button>
                        </div>
                        <button onClick={handleCreateExternalListing}>Create Listing</button>
                    </div>
                }
            />
            <Route 
                path='/add-item'
                element={<SelectItem
                    referenceData={referenceData}
                    setReferenceData={setReferenceData}
                    handleSelectItem={handleSelectItem}
                    initialEmptyMessage={initialEmptyMessage}
                />}
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
                path='/add-lot'
                element={<SelectItems
                    referenceData={referenceData}
                    setReferenceData={setReferenceData}
                    handleSelectItems={handleSelectItems}
                    initialEmptyMessage={initialEmptyItemsMessage}
                />}
            />
            <Route 
                path='/edit/:itemType/:idx'
                element={<EditListingItem 
                    listing={externalListing}
                    setListing={setExternalListing}
                />}
            />
        </Routes>
}

export default ImportListing
