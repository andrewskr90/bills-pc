import React, { useState } from 'react'
import RarityForm from '../rarity-form/index.jsx'
import Button from '../../../../../../components/buttons/text-button/index.jsx'
import BillsPcService from '../../../../../../api/bills-pc'

const RarityCard = (props) => {
    const { rarity, rarities, setRarities } = props
    const [editRarity, setEditRarity] = useState(false)
    const [editRarityFormValues, setEditRarityFormValues] = useState(rarity)

    const displayParentName = (rarity) => {
        const targetParent = rarities.filter(t => t.rarity_id === rarity.rarity_parent_id)
        if (targetParent.length > 0) return targetParent[0].rarity_name
        else return null
    }

    const updateRarity = async (rarity) => {
        try {
            const updatedRes = await BillsPcService.updateRarity({ rarity })
            const raritiesToSet = rarities.map(staleRarity => {
                if (staleRarity.rarity_id === updatedRes.data.id) {
                    return rarity
                } else return staleRarity
            })
            setRarities(raritiesToSet)
            setEditRarity(false)
        } catch (err) {
            console.log(err)
        }
    }

    const deleteRarity = async (rarity) => {
        try {
            const deletedRes = await BillsPcService.deleteRarity({ rarity })
            const raritiesToSet = rarities.filter(rarity => rarity.rarity_id !== deletedRes.data.id)
            setRarities(raritiesToSet)
            setEditRarity(false)
        } catch (err) {
            console.log(err)
        }
    }

    return (<div className='rarity'>
        {!editRarity ? <>
            <div className='name'>
                <label>Name</label>
                <h4>{rarity.rarity_name}</h4>
            </div>
            <div className='parentName'>
                <label>Parent Name</label>
                <h4>{displayParentName(rarity) || 'N/A'}</h4>
            </div>
            <Button onClick={() => setEditRarity(true)}>edit</Button>
        </> : <>
            <RarityForm rarities={rarities} toggleForm={() => setEditRarity(false)} rarityFormValues={editRarityFormValues} setRarityFormValues={setEditRarityFormValues} updateRarity={updateRarity} deleteRarity={deleteRarity} />
        </>}
    </div>)
}

export default RarityCard
