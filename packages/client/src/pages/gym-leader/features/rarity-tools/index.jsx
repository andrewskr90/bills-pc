import React, { useEffect, useState } from 'react'
import BillsPcService from '../../../../api/bills-pc'
import './assets/index.less'
import RarityManager from './features/rarity-manager/index.jsx'
import RarityGroupManager from './features/rarity-group-manager/index.jsx'

const RarityTools = (props) => {
    const [rarities, setRarities] = useState([])
    const [selectedTool, setSelectedTool] = useState('rarityManager')

    useEffect(() => {
        (async () => {
            try {
                const raritiesResponse = await BillsPcService.getRarities()
                setRarities(raritiesResponse.data)
            } catch (err) {
                console.log(err)
            }
        })()
    }, [])

    const handleChangeTool = (e) => {
        setSelectedTool(e.target.value)
    }

    return (<div className='rarityTools'>
        <select onChange={handleChangeTool}>
            <option value={'rarityManager'}>Rarity Manager</option>
            <option value={'rarityGroupManager'}>Rarity Group Manager</option>
        </select>
        {selectedTool === 'rarityManager' ? <>
            <RarityManager rarities={rarities} setRarities={setRarities} />
        </> : <>
            <RarityGroupManager rarities={rarities} />
        </>}
    </div>)
}

export default RarityTools
