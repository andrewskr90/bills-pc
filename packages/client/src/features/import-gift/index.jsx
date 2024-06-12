import React, { useState } from 'react'
import { initialImportGiftValues } from '../../data/initialData'
import Form from '../../components/form'
import ItemsTable from '../import-purchase/feature/items-table'
import PlusButton from '../../components/buttons/plus-button'
import { Route, Routes, useNavigate } from 'react-router-dom'
import SelectItem from '../../components/select-item'
import EditItem from '../../components/edit-item'
import BillsPcService from '../../api/bills-pc'

const ImportGift = (props) => {
    const { referenceData, setReferenceData } = props
    const [importGiftValues, setImportGiftValues] = useState(initialImportGiftValues)
    const navigate = useNavigate()

    const updateGiftImportValues = (e) => {
        setImportGiftValues({
            ...importGiftValues,
            [e.target.name]: e.target.value
        })
    }

    const handleUpdateCollection = (e) => {
        e.preventDefault()
        BillsPcService.postTransactionGifts([{ ...importGiftValues }])
            .then(res => {
                setImportGiftValues({
                    ...initialImportGiftValues,
                    date: importGiftValues.date
                })
            }).catch(err => {
                console.log(err)
            })
    }

    const handleSelectItem = (item) => {
        const giftedItem = {
            ...item,
            quantity: 1,
            itemNote: ''
        }
        setImportGiftValues({
            ...importGiftValues,
            items: [
                ...importGiftValues.items,
                giftedItem
            ]
        })
        navigate('/gym-leader/collection/update/import')
    }

    const updateGiftItem = (editedItem, i) => {
        const updatedGiftItems = importGiftValues.items.map((item, j) => {
            if (i === j) {
                return editedItem
            } else return item
        })
        setImportGiftValues({
            ...importGiftValues,
            items: updatedGiftItems
        })
    }

    const removeItemFromImportGift = (itemId) => {
        const filteredArray = importGiftValues.items.filter(item => {
            if (itemId === item.id) {
                return false
            } else {
                return true
            }
        })
        setImportGiftValues({
            ...importGiftValues,
            items: filteredArray
        })
    }

    const formConfig = {
        rows: [
            {
                elements: [
                    {
                        id: 'import-gift-date-input',
                        title: 'date',
                        type: 'date',
                        width: 45,
                        onChange: updateGiftImportValues,
                        name: 'date',
                        value: importGiftValues.date
                    },
                    {
                        id: 'import-gift-giver-input',
                        title: 'giver',
                        type: 'input',
                        width: 55,
                        onChange: updateGiftImportValues,
                        name: 'giver',
                        value: importGiftValues.giver
                    } 
                ]
            },
            {
                elements: [
                    {
                        id: 'import-gift-receiver-note',
                        title: 'note',
                        type: 'input',
                        width: 100,
                        onChange: updateGiftImportValues,
                        name: 'receiverNote',
                        value: importGiftValues.receiverNote
                    }
                ]
            },
            {
                elements: [
                    {
                        type: 'child',
                        childIndex: 0,
                        width: 50
                    }
                ]
            },
            {
                elements: [
                    {
                        type: 'child',
                        childIndex: 1,
                        width: 100
                    }
                ]
            },
            {
                elements: [
                    {
                        title: 'update',
                        type: 'button',
                        width: 25,
                        onClick: handleUpdateCollection,
                        styles: {
                            color: 'white',
                            backgroundColor: '#6065cb',
                            marginBottom: '100px',
                            overflow: 'auto'
                        }
                    }
                ]
            }
        ]
    }

    return (<div className='importGift'>
        <Routes>
            <Route
                path='/'
                element={<Form config={formConfig}>
                    <ItemsTable 
                        items={importGiftValues.items}
                    />
                    <PlusButton handleClick={() => navigate('add-item')} />
                </Form>}
            />
            <Route 
                path='/add-item'
                element={<SelectItem 
                    referenceData={referenceData}
                    setReferenceData={setReferenceData}
                    handleSelectItem={handleSelectItem}
                    initialEmptyMessage={'Search for an item to add to your gift import.'}
                />}
            />
            <Route 
                path='/edit-item/:idx'
                element={<EditItem 
                    purchaseValues={importGiftValues}
                    updatePurchaseItem={updateGiftItem}
                    removeItemFromPurchase={removeItemFromImportGift}
                />}
            />
        </Routes>
    </div>)
}

export default ImportGift
