import React, { useState } from 'react'
import TypeForm from '../type-form/index.jsx'
import Button from '../../../../../../components/buttons/text-button/index.jsx'
import BillsPcService from '../../../../../../api/bills-pc'

const TypeCard = (props) => {
    const { type, types, setTypes } = props
    const [editType, setEditType] = useState(false)
    const [editTypeFormValues, setEditTypeFormValues] = useState(type)

    const displayParentName = (type) => {
        const targetParent = types.filter(t => t.type_id === type.type_parent_id)
        if (targetParent.length > 0) return targetParent[0].type_name
        else return null
    }

    const updateType = async (type) => {
        try {
            const updatedRes = await BillsPcService.updateType({ type })
            const typesToSet = types.map(staleType => {
                if (staleType.type_id === updatedRes.data.id) {
                    return type
                } else return staleType
            })
            setTypes(typesToSet)
            setEditType(false)
        } catch (err) {
            console.log(err)
        }
    }

    const deleteType = async (type) => {
        try {
            const deletedRes = await BillsPcService.deleteType({ type })
            const typesToSet = types.filter(type => type.type_id !== deletedRes.data.id)
            setTypes(typesToSet)
            setEditType(false)
        } catch (err) {
            console.log(err)
        }
    }

    return (<div className='type'>
        {!editType ? <>
            <div className='name'>
                <label>Name</label>
                <h4>{type.type_name}</h4>
            </div>
            <div className='parentName'>
                <label>Parent Name</label>
                <h4>{displayParentName(type) || 'N/A'}</h4>
            </div>
            <Button onClick={() => setEditType(true)}>edit</Button>
        </> : <>
            <TypeForm types={types} toggleForm={() => setEditType(false)} typeFormValues={editTypeFormValues} setTypeFormValues={setEditTypeFormValues} updateType={updateType} deleteType={deleteType} />
        </>}
    </div>)
}

export default TypeCard
