import React, { useEffect, useState } from "react"
import { Route, Routes, useNavigate } from "react-router-dom"
import SelectItem from "../../../../components/select-item"
import BillsPcService from "../../../../api/bills-pc"
import { initialExternalListing, initialSortingSplitValues } from "../../../../data/initialData"
import BulkEditor from "../../../../components/bulk-editor"
import editPNG from '../../assets/edit.png'
import EditListingItem from './EditListingItem'

const ImportListing = (props) => {
    const { referenceData, setReferenceData } = props
    const [externalListing, setExternalListing] = useState(initialExternalListing)
    const [createdProxyUsers, setCreatedProxyUsers] = useState([])
    const navigate = useNavigate()
    const initialEmptyMessage = "Select item to import"
    const handleSelectItem = (item) => {
        if (item.card_id) {
            setExternalListing({
                ...externalListing,
                cards: [
                    ...externalListing.cards,
                    {
                        ...item,
                        note: ''
                    }
                ]
            })
        } else if (item.product_id) {
            setExternalListing({
                ...externalListing,
                products: [
                    ...externalListing.products,
                    {
                        ...item,
                        note: ''
                    }
                ]
            })
        }
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
    useEffect(() => {
        (async () => {
            await BillsPcService.getProxyUsers()
                .then(res => setCreatedProxyUsers(res.data))
                .catch(err => console.log(err))
        })()
    }, [])
    const Selector = (props) => {
        const { handleSelect, handleCreateNew, items, searchKey } = props
        const [searchInput, setSearchInput] = useState("")
        return (
            <div style={{ width: '200px' }}>
                <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
                {searchInput ? (
                    <div style={{ width: '100%' }}>
                        {!items.find(item => item[searchKey].toLowerCase() === searchInput.toLocaleLowerCase()) ? (<button style={{ width: '100%' }} onClick={() => handleCreateNew(searchInput)}>Create New Seller</button>) : (<></>)}
                        {items.filter(item => item[searchKey].includes(searchInput.toLowerCase()))
                            .map(item => <button style={{ width: '100%' }} onClick={() => handleSelect(item)}>{item[searchKey]}</button>)}
                    </div>
                ) : (<></>)}
            </div>
        )
    }
    const createNewProxyUser = async (newProxyUser) => {
        try {
            const { data: { id } } = await BillsPcService.postProxyUser({ data: newProxyUser })
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
                <Selector 
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
    console.log(externalListing)
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
                                <ProxyUserSelector handleSelectUser={(id) => setExternalListing} />
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

                        {externalListing.cards.length + 
                        externalListing.products.length +
                        externalListing.bulkSplits.length > 1  ? (
                            <p>Lot Items</p> 
                        ) : (
                            <p>Item</p>
                        )}
                        {externalListing.cards.map((card, idx) => {
                            console.log(card)
                            return (<div style={{ display: 'flex ', width: '100%', justifyContent: 'space-around' }}>
                                {card.name}
                                <img src={editPNG} onClick={() => handleEditItem('card', idx)} />
                            </div>)
                        })}
                        {externalListing.products.map((product, idx) => {
                            console.log(product)
                            return (<div style={{ display: 'flex ', width: '100%', justifyContent: 'space-around' }}>
                                <p>{product.name}</p>
                                <img src={editPNG} onClick={() => handleEditItem('product', idx)} />
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
                path='/edit/:itemType/:idx'
                element={<EditListingItem 
                    listing={externalListing}
                    setListing={setExternalListing}
                />}
            />
        </Routes>
}

export default ImportListing
