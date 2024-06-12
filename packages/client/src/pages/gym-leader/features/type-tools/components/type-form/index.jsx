import React from 'react'
import Button from '../../../../../../components/buttons/text-button/index.jsx'
import './assets/index.less'
const TypeForm = (props) => {
    const { 
        types,
        toggleForm,
        createType,
        updateType,
        deleteType,
        typeFormValues,
        setTypeFormValues, 
    } = props

    const handleChangeFormValues = (e) => {
        setTypeFormValues({
            ...typeFormValues,
            [e.target.name]: e.target.value
        })
    }

    const handleCreateType = (e) => {
        e.preventDefault()
        createType(typeFormValues)
    }

    const handleUpdateType = (e) => {
        e.preventDefault()
        updateType(typeFormValues)
    }
    
    const handleDeleteType = (e) => {
        e.preventDefault()
        deleteType(typeFormValues)
    }

    return (<div className='typeForm'>
        <h3>New Type</h3>
        <form>
            <label>Name</label>
            <input 
                type='text'
                name='type_name'
                value={typeFormValues.type_name}
                onChange={handleChangeFormValues}
            />
            <label>Parent</label>
            <select name='type_parent_id' value={typeFormValues.type_parent_id} onChange={handleChangeFormValues}>
                <option value={null}>--Select Parent--</option>
                {types.map(type => <option value={type.type_id}>{type.type_name}</option>)}
            </select>
            <div className='buttons'>
                {createType ? <Button onClick={handleCreateType}>Create</Button> : <></>}
                {updateType ? <Button onClick={handleUpdateType}>Update</Button> : <></>}
                {deleteType ? <Button onClick={handleDeleteType}>Delete</Button> : <></>}
                <Button onClick={toggleForm}>Cancel</Button>
            </div>
        </form>
    </div>)
}

export default TypeForm
