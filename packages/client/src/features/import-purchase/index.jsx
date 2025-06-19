import React, { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import ItemsTable from './feature/items-table/index.jsx'
import { initialPurchaseValues, purchaseInitialSplitValues } from '../../data/initialData'
import SelectItem from '../../components/select-item/index.jsx'
import EditItem from '../../components/edit-item/index.jsx'
import BillsPcService from '../../api/bills-pc'
import PlusButton from '../../components/buttons/plus-button/index.jsx'
import './assets/importPurchase.css'
import Button from '../../components/buttons/text-button/index.jsx'
import BulkEditor from '../../components/bulk-editor/index.jsx'
import SearchAndSelect from '../../components/search-and-select/index.jsx'

const ImportPurchase = (props) => {
    const [purchaseValues, setPurchaseValues] = useState(initialPurchaseValues)
    const { 
        referenceData, 
        setReferenceData
    } = props
    const [addItemOrBulk, setAddItemOrBulk] = useState('item')
    const [vendorName, setVendorName] = useState('')
    const navigate = useNavigate()
    const [searchedProxyUsers, setSearchedProxyUsers] = useState([])
    const initialEmptyMessage = 'Search for an item to add to your purchase.'
    const updatePurchaseItem = (editedItem, i) => {
        const updatedPurchaseItems = purchaseValues.items.map((item, j) => {
            if (i === j) {
                return editedItem
            } else return item
        })
        setPurchaseValues({
            ...purchaseValues,
            items: updatedPurchaseItems
        })
    }

    const handleChangeVendorName = (e) => {
        clearTimeout(timeoutId)
        setVendorName(e.target.value)
        setTimeoutId(setTimeout(async () => {
            const params = { proxy: true, user_name: e.target.value }
            await BillsPcService.getUsers({ params })
                .then(res => setSearchedProxyUsers(res.data.users))
                .catch(err => console.log(err))
        }, 500))
    }

    const updatePurchaseValues = (e) => {
        let { name, value } = e.target
        let updatedValue = value
        setPurchaseValues({
            ...purchaseValues,
            [name]: updatedValue
        })
    }

    const handleSelectItem = (item) => {
        const purchasedItem = {
            ...item,
            quantity: 1,
            retail: null,
            itemNote: ''
        }
        setPurchaseValues({
            ...purchaseValues,
            items: [
                ...purchaseValues.items,
                purchasedItem
            ]
        })
        navigate(-1)
    }

    const updateBulkSplits = (updatedBulkSplits) => {
        setPurchaseValues({
            ...purchaseValues,
            bulkSplits: updatedBulkSplits
        })
    }
    
    const removeItemFromPurchase = (itemId) => {
        const filteredArray = purchaseValues.items.filter(item => {
            if (itemId === item.id) {
                return false
            } else {
                return true
            }
        })
        setPurchaseValues({
            ...purchaseValues,
            items: filteredArray
        })
    }

    const handleUpdateCollection = (e) => {
        e.preventDefault()
        BillsPcService.postTransactionSales([{ ...purchaseValues }])
            .then(res => {
                setPurchaseValues({
                    ...initialPurchaseValues,
                    date: purchaseValues.date
                })
                // navigate('/')
            }).catch(err => {
                console.log(err)
            })
    }

    const handleSelectTypeToAdd = (e) => {
        setAddItemOrBulk(e.target.value)
    }

    const handleToggleSelectItem = () => navigate('add-item')
    const handleToggleAddBulk = () => navigate('add-bulk')

    const addSplitToPurchase = (split) => {
        setPurchaseValues({
            ...purchaseValues,
            bulkSplits: [
                ...purchaseValues.bulkSplits,
                split
            ]
        })
        navigate('/gym-leader/collection/update/purchase')
    }

    const updateSplitInBulkValues = (updatedSplit, idx) => {
        const updatedBulkSplits = purchaseValues.bulkSplits.map((split, i) => {
            if (i === parseInt(idx)) return updatedSplit
            return split
        })
        setPurchaseValues({
            ...purchaseValues,
            bulkSplits: updatedBulkSplits
        })
        navigate('/gym-leader/collection/update/purchase')
    }

    const purchaseItemsValue = () => {
        let value = 0
        purchaseValues.items.forEach(item => {
            value += item.quantity*(item.marketValue[item.printings[0]])
        })
        return value
    }

    const createNewProxyUser = async (newProxyUser) => {
        try {
            const { data: { id } } = await BillsPcService.postUser({ data: { user_name: newProxyUser }, params: { proxy: true } })
            setSearchedProxyUsers([...searchedProxyUsers, { user_name: newProxyUser, user_id: id }])
            setPurchaseValues({ ...purchaseValues, sellerId: id })
        } catch (err) {
            console.log(err)
        }
    }

    const ProxyUserSelector = () => {
        return (
            purchaseValues.sellerId ? (
                <p>{searchedProxyUsers.find(user => user.user_id === purchaseValues.sellerId).user_name}</p>
                ) : (
                <SearchAndSelect 
                    selected={searchedProxyUsers.find(user => user.user_id === purchaseValues.sellerId)}
                    value={vendorName}
                    handleChange={handleChangeVendorName}
                    searched={searchedProxyUsers} 
                    displayKey="user_name" 
                    handleSelect={((selectedProxyUser) => {
                        setPurchaseValues({
                            ...purchaseValues,
                            sellerId: selectedProxyUser.user_id
                        })

                    })} 
                    label="Vendor"
                    handleCreateNew={(user_name => createNewProxyUser({ user_name }))}
                    createNewText="Create New Seller"
                />
            )
        )
    }
    return (<div className='page importPurchase'>
        <Routes>
            <Route 
                path='/' 
                element={<form className='purchaseForm'>
                    <div className='dateAndVendor'>
                        <div className='labelInput date'>
                            <label>Date</label>
                            <input 
                                id='date'
                                className='date'
                                name='date'
                                type='date'
                                value={purchaseValues.date}
                                onChange={updatePurchaseValues}
                            />
                        </div>
                        <div className='labelInput vendor'>
                            <label>Vendor</label>
                            <ProxyUserSelector />
                            {/* <input 
                                id='vendor'
                                className='vendor'
                                name='vendor'
                                type='text'
                                value={purchaseValues.vendor}
                                onChange={updatePurchaseValues}
                            /> */}
                        </div>
                    </div>
                    <div className='labelInput purchaserNote'>
                        <label>Note</label>
                        <input 
                            id='purchaserNote'
                            className='purchaserNote'
                            name='purchaserNote'
                            type='text'
                            value={purchaseValues.purchaserNote}
                            onChange={updatePurchaseValues}
                        />
                    </div>
                    <select 
                        className='addItemOrBulk' 
                        onChange={handleSelectTypeToAdd}
                        value={addItemOrBulk}
                        style={{ width: '25%', marginTop: '10px' }}
                    >
                        <option value='item'>Item</option>
                        <option value='bulk'>Bulk</option>
                    </select>
                    {addItemOrBulk === 'item' ? <>
                        <ItemsTable 
                            format='item'
                            items={purchaseValues.items}
                            referenceData={referenceData}
                        />
                        <PlusButton handleClick={handleToggleSelectItem} />                                
                    </> : <>
                        <ItemsTable 
                            format='bulk'
                            items={purchaseValues.bulkSplits}
                            referenceData={referenceData}
                        />
                        <PlusButton handleClick={handleToggleAddBulk} />
                    </>}
                    <p>Market Value: {purchaseItemsValue()}</p>
                    <div className='discountSubtotalAndTax'>
                        <div className='labelInput discount'>
                            <label>Discount</label>
                            <input 
                                id='discount'
                                className='discount'
                                name='discount'
                                type='text'
                                value={purchaseValues.discount}
                                onChange={updatePurchaseValues}
                            />
                        </div>
                        <div className='labelInput subtotal'>
                            <label>Subtotal</label>
                            <input 
                                id='subtotal'
                                className='subtotal'
                                name='subtotal'
                                type='text'
                                value={purchaseValues.subtotal}
                                onChange={updatePurchaseValues}
                            />
                        </div>
                        <div className='labelInput taxAmount'>
                            <label>Tax</label>
                            <input 
                                id='taxAmount'
                                 className='taxAmount'
                                name='taxAmount'
                                type='text'
                                value={purchaseValues.taxAmount}
                                onChange={updatePurchaseValues}
                            />
                        </div>
                    </div>
                    <div className='shippingAndTotal'>
                        <div className='labelInput shipping'>
                            <label>Shipping</label>
                            <input 
                                id='shipping'
                                className='shipping'
                                name='shipping'
                                type='text'
                                value={purchaseValues.shipping}
                                onChange={updatePurchaseValues}
                            />
                        </div>
                        <div className='labelInput total'>
                            <label>Total</label>
                            <input 
                                id='total'
                                className='total'
                                name='total'
                                type='text'
                                value={purchaseValues.total}
                                onChange={updatePurchaseValues}
                            />
                        </div>
                    </div>
                    <Button style={{ marginTop: '10px' }} onClick={handleUpdateCollection}>Update</Button>
                </form>} 
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
                path='/edit-item/:idx'
                element={<EditItem 
                    includeRetail={true}
                    purchaseValues={purchaseValues}
                    updatePurchaseItem={updatePurchaseItem}
                    removeItemFromPurchase={removeItemFromPurchase}
                />}
            />
            <Route 
                path='/add-bulk'
                element={<BulkEditor 
                    initialSplitValues={purchaseInitialSplitValues}
                    addSplitToTransaction={addSplitToPurchase}
                    referenceData={referenceData}
                />}
            />
            <Route 
                path='/edit-bulk/:idx'
                element={<BulkEditor 
                    initialSplitValues={purchaseInitialSplitValues}
                    referenceData={referenceData}
                    updateSplitInBulkValues={updateSplitInBulkValues}
                    purchaseValues={purchaseValues}
                />}
            />
        </Routes>
    </div>)
}

export default ImportPurchase
