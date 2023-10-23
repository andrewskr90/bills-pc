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
    const navigate = useNavigate()
    const initialEmptyMessage = "Select item to import"
    const handleSelectItem = (item) => {
        if (item.card_id) {
            setExternalListing({
                ...externalListing,
                cards: [
                    ...externalListing.cards,
                    item
                ]
            })
        } else if (item.product_id) {
            setExternalListing({
                ...externalListing,
                products: [
                    ...externalListing.products,
                    item
                ]
            })
        }
        navigate('/gym-leader/collection/watching/import')
    }
    const handleCreateExternalListing = async () => {
        await BillsPcService.postListing({ data: externalListing, params: { external: true } })
    }
    console.log(externalListing)
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
                        {!items.find(item => item.name.toLowerCase() === searchInput.toLocaleLowerCase()) ? (<button style={{ width: '100%' }} onClick={() => handleCreateNew(searchInput)}>Create New Seller</button>) : (<></>)}
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
            setCreatedProxyUsers([...createdProxyUsers, { ...newProxyUser, id }])
            setExternalListing({ ...externalListing, sellerId: id })
        } catch (err) {

        }
    }

    const ProxyUserSelector = () => {
        return (
            externalListing.sellerId ? (
                <p>{createdProxyUsers.find(user => user.id === externalListing.sellerId).name}</p>
                ) : (
                <Selector 
                    searchKey="name" 
                    items={createdProxyUsers} 
                    handleSelect={((selectedProxyUser) => {
                        setExternalListing({
                            ...externalListing,
                            sellerId: selectedProxyUser.id
                        })

                    })} 
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

                        {(externalListing.cards.length + externalListing.products.length) > 1 ? (
                            <p>Lot Items</p> 
                        ) : (
                            <p>Item</p>
                        )}
                        {externalListing.cards.map(card => {
                            return <p>{card.name}</p>
                        })}
                        {externalListing.products.map(product => {
                            return <p>{product.name}</p>
                        })}
                        <PlusButton handleClick={() => navigate('add-item')} />
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
        </Routes>
}

export default ImportListing
