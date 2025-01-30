import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const EditListingItem = (props) => {
    const { listing, setListing, handleChange } = props
    const navigate = useNavigate()
    const params = useParams()
    const itemType = params['itemType']
    const idx = params['idx']
    const listingItem = listing[`${itemType}s`][idx]
    useEffect(() => {
        if (listing[`${itemType}s`].length <= idx) {
            navigate('/gym-leader/collection/listings/import')
        }
    }, [])
    const handleDeleteItem = () => {
        setListing({
            ...listing,
            [`${itemType}s`]: listing[`${itemType}s`].filter((item, idxToDelete) => {
                return parseInt(idx) !== idxToDelete
            })
        })
        navigate('/gym-leader/collection/listings/import')
    }
    const handleSaveItem = () => {
        navigate('/gym-leader/collection/listings/import')
    }

    return (listing[`${itemType}s`].length > idx ? 
        <div>
            <label>Note</label>
            <input name='note' value={listingItem.note} onChange={(e) => handleChange(e, idx)} />
            <button onClick={handleDeleteItem}>delete</button>
            <button onClick={handleSaveItem}>save</button>
        </div>
    : <>loading...</>)
}

export default EditListingItem
