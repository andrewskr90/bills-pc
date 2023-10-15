import React, { useEffect, useState } from "react"
import { Route, Routes, useNavigate } from "react-router-dom"
import SelectItem from "../../../../components/select-item"
import PlusButton from "../../../../components/buttons/plus-button"
import BillsPcService from "../../../../api/bills-pc"
import { initialExternalListing, initialProxyUser } from "../../../../data/initialData"

const ImportListing = (props) => {
    const { referenceData, setReferenceData } = props
    const [externalListing, setExternalListing] = useState(initialExternalListing)
    const [createdProxyUsers, setCreatedProxyUsers] = useState([])
    const [proxyUser, setProxyUser] = useState(initialProxyUser)
    const navigate = useNavigate()
    const initialEmptyMessage = "Select item to import"
    const handleSelectItem = (item) => {
        setExternalListing({
            ...externalListing,
            items: [
                ...externalListing.items,
                {
                    ...item,
                    quantity: 1,
                    price: null,
                }
            ]
        })
        navigate('/gym-leader/collection/watching/import')
    }
    useEffect(() => {
        (async () => {
            await BillsPcService.getProxyUsers()
                .then(res => setCreatedProxyUsers(res.data))
                .catch(err => console.log(err))
        })()
    }, [])
    const Selector = (props) => {
        const { handleSelect, handleCreateNew, selected, items, searchKey } = props
        const [searchInput, setSearchInput] = useState("")
        return (
            selected[searchKey] ? (<p>selected</p>) : (
                <div style={{ width: '200px' }}>
                    <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
                    {searchInput ? (
                        <div style={{ width: '100%' }}>
                            {!items.find(item => item.name.toLowerCase() === searchInput.toLocaleLowerCase()) ? (<button style={{ width: '100%' }} onClick={() => handleCreateNew(searchInput)}>Create New Seller</button>) : (<></>)}
                            {items.filter(item => item[searchKey].includes(searchInput.toLowerCase()))
                                .map(item => <button style={{ width: '100%' }} onClick={() => handleSelect(item)}>{item[searchKey]}</button>)}
                        </div>
                    ) : (<></>)}
                </div>
            )
        )
    }
    const createNewProxyUser = async (newProxyUser) => {
        try {
            const { data: { id } } = await BillsPcService.postProxyUser({ data: newProxyUser })
            setCreatedProxyUsers([...createdProxyUsers, { ...newProxyUser, id }])
            setProxyUser({ ...newProxyUser, id })
        } catch (err) {

        }
    }

    const ProxyUserSelector = () => {
        return (
            proxyUser.id ? (
                <p>{proxyUser.name.toUpperCase()}</p>
                ) : (
                <Selector 
                    searchKey="name" 
                    items={createdProxyUsers} 
                    selected={proxyUser} 
                    handleSelect={((selectedProxyUser) => setProxyUser(selectedProxyUser))} 
                    handleCreateNew={(name => createNewProxyUser({ name }))}
                />
            )
        )
    }
    return <Routes>
            <Route
                path="/"
                element={
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <p>External Listing</p>
                        <div style={{ display: 'flex' }}>
                            <label>
                                Date
                                <input type="date" value={externalListing.date} />
                            </label>
                            <label>
                                Seller
                                <ProxyUserSelector />
                            </label>
                        </div>
                        {externalListing.items.length > 1 ? <p>Lot Items</p> : <p>Item</p>}
                        {externalListing.items.map(item => {
                            return <p>{item.name}</p>
                        })}
                        <PlusButton handleClick={() => navigate('add-item')} />
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
        </Routes>
}

export default ImportListing
