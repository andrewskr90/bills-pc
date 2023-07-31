import React, { useEffect, useState } from 'react'
import Button from '../../../../../../components/buttons/text-button'

const initialRarityGroupFormValues = {
    name: null,
    rarities: []
}

const RarityGroupManager = (props) => {
    const { rarities } = props
    const [rarityGroups, setRarityGroups] = useState([])
    const [formToggled, setFormToggled] = useState(false)
    const [rarityGroupFormValues, setRarityGroupFormValues] = useState(initialRarityGroupFormValues)

    useEffect(() => {
        (async () => {
            
        })()
    })

    const toggleForm = () => setFormToggled(!formToggled)

    const createRarityGroup = () => {

    }

    const RarityGroupForm = (props) => {
        return (<div className='rarityGroupForm'>

        </div>)
    }

    const RarityGroupCard = (props) => {
        return (<div className='rarityGroupCard'>

        </div>)
    }

    return (<div className='rarityGroupManager'>
        {formToggled ? <>
            {<RarityGroupForm rarityGroupFormValues={rarityGroupFormValues} rarities={rarities} toggleForm={toggleForm} createRarity={createRarityGroup} setRarityGroupFormValues={setRarityGroupFormValues} />}
        </> : <>
            <Button onClick={() => setFormToggled(true)}>+ Rarity Group</Button>
        </>}
        <div className='rarities'>
            {rarityGroups.map((rarityGroup, idx) => {
                return (<RarityGroupCard key={idx} rarity={rarityGroup} rarities={rarities} setRarities={setRarityGroups} />)
            })}
        </div>
    </div>)
}

export default RarityGroupManager
