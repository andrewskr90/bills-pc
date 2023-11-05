import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const EditListingItem = (props) => {
    const { listing, setListing } = props
    const navigate = useNavigate()
    const params = useParams()
    const itemType = params['itemType']
    const idx = params['idx']
    useEffect(() => {
        if (listing[`${itemType}s`].length <= idx) {
            navigate('/gym-leader/collection/watching/import')
        }
    }, [])
    const handleDeleteItem = () => {
        setListing({
            ...listing,
            [`${itemType}s`]: listing[`${itemType}s`].filter((item, idxToDelete) => {
                return parseInt(idx) !== idxToDelete
            })
        })
        navigate('/gym-leader/collection/watching/import')
    }
    const handleSaveItem = () => {
        navigate('/gym-leader/collection/watching/import')
    }
    const handleChange = (e) => {
        setListing({
            ...listing,
            [`${itemType}s`]: listing[`${itemType}s`].map((item, idxToUpdate) => {
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
    return (listing[`${itemType}s`].length > idx ? 
        <div>
            <label>Note</label>
            <input name='note' value={listing[`${itemType}s`][idx].note} onChange={handleChange} />
            <button onClick={handleDeleteItem}>delete</button>
            <button onClick={handleSaveItem}>save</button>
        </div>
    : <>loading...</>)
}

export default EditListingItem
