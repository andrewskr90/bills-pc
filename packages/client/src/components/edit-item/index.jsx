import React, { useState } from 'react'
import Form from '../form/index.jsx'
import { useLocation, useNavigate } from 'react-router-dom'
import Banner from '../../layouts/banner/index.jsx'
import { buildPreviousRoute, parseLastRouteParameter } from '../../utils/location'
import './assets/editItem.css'

const EditItem = (props) => {
    const { purchaseValues, updatePurchaseItem, removeItemFromPurchase, includeRetail } = props
    const location = useLocation()
    const [itemIndex, setItemIndex] = useState(parseInt(parseLastRouteParameter(location)))
    const [itemValues, setItemValues] = useState(purchaseValues.items[itemIndex])
    const navigate = useNavigate()

    const handleClickBackArrow = () => {
        navigate(buildPreviousRoute(location, 2))
    }

    const handleDeleteItem = (e) => {
        e.preventDefault()
        const itemId = purchaseValues.items[itemIndex].id
        removeItemFromPurchase(itemId)
        navigate(buildPreviousRoute(location, 2))
    }

    const handleSaveItem = (e) => {
        e.preventDefault()
        updatePurchaseItem(itemValues, itemIndex)
        navigate(buildPreviousRoute(location, 2))
    }

    const updateItemValues = (e) => {
        setItemValues({
            ...itemValues,
            [e.target.name]: e.target.value
        })
    }

    const formConfig = {
        rows: [
            {
                elements: [
                    {
                        id: purchaseValues.items[itemIndex].id,
                        title: 'price',
                        type: 'input',
                        width: 60,
                        onChange: updateItemValues,
                        name: 'retail',
                        value: itemValues.retail
                    },
                    {
                        id: purchaseValues.items[itemIndex].id,
                        title: 'quantity',
                        type: 'input',
                        width: 40,
                        onChange: updateItemValues,
                        name: 'quantity',
                        value: itemValues.quantity
                    } 
                ]
            },
            {
                elements: [
                    {
                        id: purchaseValues.items[itemIndex].id,
                        title: 'note',
                        type: 'input',
                        width: 100,
                        onChange: updateItemValues,
                        name: 'itemNote',
                        value: itemValues.itemNote
                    }
                ]
            },
            {
                elements: [
                    {
                        title: 'delete',
                        type: 'button',
                        width: 25,
                        onClick: handleDeleteItem,
                        styles: {
                            color: '#a00000',
                            borderColor: '#a00000',
                            backgroundColor: 'white'
                        }
                    },
                    {
                        title: 'save',
                        type: 'button',
                        width: 25,
                        onClick: handleSaveItem,
                        styles: {
                            color: '#6065cb',
                            borderColor: '#6065cb',
                            backgroundColor: 'white'
                        }
                    }
                ]
            }
        ]
    }

    if (!includeRetail) formConfig.rows[0].elements.shift()

    return (<div className='editItem page'>
        <Banner titleText={'Edit Item'} handleClickBackArrow={handleClickBackArrow} />
        <img className='itemImage' src={`https://product-images.tcgplayer.com/fit-in/656x656/${purchaseValues.items[itemIndex].tcgpId}.jpg`}/>
        <h3 className='itemName'>{purchaseValues.items[itemIndex].name}</h3>
        <p className='expansionName'>{purchaseValues.items[itemIndex].set.name}</p>
        <Form config={formConfig} />
    </div>)
}

export default EditItem
