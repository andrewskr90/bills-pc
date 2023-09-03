import React, { useEffect, useState } from 'react'
import Button from '../../../../components/buttons/text-button'
import BillsPcService from '../../../../api/bills-pc'
import './assets/index.less'
import TypeForm from './components/type-form'
import TypeCard from './components/type-card'

const initialTypeFormValues = {
    type_id: '',
    type_name: '',
    type_parent_id: null
}

const TypeTools = (props) => {
    const [types, setTypes] = useState([])
    const [formToggled, setFormToggled] = useState(false)
    const [typeFormValues, setTypeFormValues] = useState(initialTypeFormValues)
    const [selectedTool, setSelectedTool] = useState('typeManager')

    useEffect(() => {
        (async () => {
            try {
                const typesResponse = await BillsPcService.getTypes()
                setTypes(typesResponse.data)
            } catch (err) {
                console.log(err)
            }
        })()
    }, [])

    const toggleForm = () => {
        setFormToggled(!formToggled)
    }

    const createType = async (type) => {
        const config = {
            data: type
        }
        try {
            const postTypeResponse = await BillsPcService.postType(config)
            setTypes([
                ...types,
                {
                    ...type,
                    type_id: postTypeResponse.data.id
                }
            ])
            setFormToggled(false)
            setTypeFormValues(initialTypeFormValues)
        } catch (err) {
            console.log(err)
        }
    }

    const handleChangeTool = (e) => {
        setSelectedTool(e.target.value)
    }

    return (<div className='typeManager'>
        <select onChange={handleChangeTool}>
            <option value={'typeManager'}>Type Manager</option>
            <option value={'typeGroupManager'}>Type Group Manager</option>
        </select>
        {selectedTool === 'typeManager' ? <>
            {formToggled ? <>
                {<TypeForm typeFormValues={typeFormValues} types={types} toggleForm={toggleForm} createType={createType} setTypeFormValues={setTypeFormValues} />}
            </> : <>
                <Button onClick={() => setFormToggled(true)}>+ Type</Button>
            </>}
            <div className='types'>
                {types.map((type, idx) => {
                    return (<TypeCard key={idx} type={type} types={types} setTypes={setTypes} />)
                })}
            </div>
        </> : <></>}
    </div>)
}

export default TypeTools
