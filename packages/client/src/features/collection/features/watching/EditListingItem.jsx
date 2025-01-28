import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const EditListingItem = (props) => {
    const { listing, setListing, referenceData } = props
    const navigate = useNavigate()
    const params = useParams()
    const itemType = params['itemType']
    const idx = params['idx']
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
    const { condition, printing } = referenceData.bulk

    return (listing[`${itemType}s`].length > idx ? 
        <div>
            <label>Note</label>
            <input name='note' value={listing[`${itemType}s`][idx].note} onChange={handleChange} />
            <button onClick={handleDeleteItem}>delete</button>
            <button onClick={handleSaveItem}>save</button>
            <label>Condition</label>
            <select name='condition' onChange={handleChange}>
                {listing[`${itemType}s`][idx].sealed ? <>
                    <option value={'7e464ec6-0b23-11ef-b8b9-0efd996651a9'}>{condition.find(c => c.condition_id === '7e464ec6-0b23-11ef-b8b9-0efd996651a9').condition_name}</option>
                </> : <>
                    {condition.filter(c => c.condition_id !== '7e464ec6-0b23-11ef-b8b9-0efd996651a9').map(c => {
                        return <option value={c.condition_id}>{c.condition_name}</option>
                    })}
                </>}
            </select>
            <label>Printing</label>
            <select name='printing' onChange={handleChange}>
                {listing[`${itemType}s`][idx].printings.map(p => {
                    return <option value={p}>{printing.find(pRef => pRef.printing_id === p).printing_name}</option>
                })}
            </select>
        </div>
    : <>loading...</>)
}

export default EditListingItem
