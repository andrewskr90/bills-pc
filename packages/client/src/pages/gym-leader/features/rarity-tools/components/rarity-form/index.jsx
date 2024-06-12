import React, { useState } from 'react'
import Button from '../../../../../../components/buttons/text-button/index.jsx'
import './assets/index.less'

const RarityForm = (props) => {
    const { 
        rarities,
        toggleForm,
        createRarity,
        updateRarity,
        deleteRarity,
        rarityFormValues,
        setRarityFormValues, 
    } = props

    const handleChangeFormValues = (e) => {
        let value = e.target.value
        if (e.target.value === '--Select Parent--') value = null
        setRarityFormValues({
            ...rarityFormValues,
            [e.target.name]: value
        })
    }

    const handleCreateRarity = (e) => {
        e.preventDefault()
        createRarity(rarityFormValues)
    }

    const handleUpdateRarity = (e) => {
        e.preventDefault()
        console.log(rarityFormValues)
        updateRarity(rarityFormValues)
    }
    
    const handleDeleteRarity = (e) => {
        e.preventDefault()
        deleteRarity(rarityFormValues)
    }
    const nullValue = null
    return (<div className='rarityForm'>
        <h3>New Rarity</h3>
        <form>
            <label>Name</label>
            <input 
                rarity='text'
                name='rarity_name'
                value={rarityFormValues.rarity_name}
                onChange={handleChangeFormValues}
            />
            <label>Parent</label>
            <select name='rarity_parent_id' value={rarityFormValues.rarity_parent_id} onChange={handleChangeFormValues}>
                <option>--Select Parent--</option>
                {rarities.map(rarity => <option value={rarity.rarity_id}>{rarity.rarity_name}</option>)}
            </select>
            <div className='buttons'>
                {createRarity ? <Button onClick={handleCreateRarity}>Create</Button> : <></>}
                {updateRarity ? <Button onClick={handleUpdateRarity}>Update</Button> : <></>}
                {deleteRarity ? <Button onClick={handleDeleteRarity}>Delete</Button> : <></>}
                <Button onClick={toggleForm}>Cancel</Button>
            </div>
        </form>
    </div>)
}

export default RarityForm
