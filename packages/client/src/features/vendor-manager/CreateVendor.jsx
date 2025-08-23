import React, { useState } from 'react'
import BillsPcService from '../../api/bills-pc'
import PreviousRoutes from '../../layouts/previous-routes'
import Button from '../../components/buttons/text-button'

const initialVendorValues = { user_name: '' }

const CreateVendor = () => {
    const [newVendor, setNewVendor] = useState(initialVendorValues)
    const [newVendorError, setNewVendorError] = useState('')

    const handleCreateNewVendor = async (e) => {
        e.preventDefault()
        await BillsPcService.postUser({ data: newVendor, params: { proxy: true } })
            .then(res => {
                setNewVendor(initialVendorValues)
                navigate(-1)
            })
            .catch(err => {
                setNewVendorError(err.response.data.message)
            })
    }

    return (<>
        <PreviousRoutes location={location} />
        <form id='createVendorForm' onSubmit={handleCreateNewVendor}>
            <label>Name
                <input 
                    value={newVendor.user_name}
                    name='user_name'
                    onChange={(e) => {
                        setNewVendorError('')
                        setNewVendor({ 
                            ...newVendor, 
                            [e.target.name]: e.target.value
                        })
                    }}
                />
            </label>
            {newVendorError && <p className='text-red'>{newVendorError}</p>}
            <Button type='submit' form='createVendorForm'>Create</Button>
        </form></>)
}

export default CreateVendor