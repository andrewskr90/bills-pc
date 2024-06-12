import React, { useState } from 'react'
import BillsPcService from '../../../../../../api/bills-pc'
import './assets/index.less'
import Button from '../../../../../../components/buttons/text-button/index.jsx'
import RarityForm from '../../components/rarity-form/index.jsx'
import RarityCard from '../../components/rarity-card/index.jsx'

const initialRarityFormValues = {
    rarity_id: '',
    rarity_name: '',
    rarity_parent_id: null
}

const RarityManager = (props) => {
    const { rarities, setRarities } = props
    const [formToggled, setFormToggled] = useState(false)
    const [rarityFormValues, setRarityFormValues] = useState(initialRarityFormValues)

    const toggleForm = () => {
        setFormToggled(!formToggled)
    }

    const createRarity = async (rarity) => {
        const config = {
            data: rarity
        }
        try {
            const postRarityResponse = await BillsPcService.postRarity(config)
            setRarities([
                ...rarities,
                {
                    ...rarity,
                    rarity_id: postRarityResponse.data.id
                }
            ])
            setFormToggled(false)
            setRarityFormValues(initialRarityFormValues)
        } catch (err) {
            console.log(err)
        }
    }

    return (<div className='rarityManager'>
        {formToggled ? <>
            {<RarityForm rarityFormValues={rarityFormValues} rarities={rarities} toggleForm={toggleForm} createRarity={createRarity} setRarityFormValues={setRarityFormValues} />}
        </> : <>
            <Button onClick={() => setFormToggled(true)}>+ Rarity</Button>
        </>}
        <div className='rarities'>
            {rarities.map((rarity, idx) => {
                return (<RarityCard key={idx} rarity={rarity} rarities={rarities} setRarities={setRarities} />)
            })}
        </div>
    </div>)
}

export default RarityManager
