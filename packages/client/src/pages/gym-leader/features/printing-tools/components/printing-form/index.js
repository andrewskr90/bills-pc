import React, { useState } from 'react'
import Button from '../../../../../../components/buttons/text-button'
import './assets/index.less'
const PrintingForm = (props) => {
    const { 
        printings,
        toggleForm,
        createPrinting,
        updatePrinting,
        deletePrinting,
        printingFormValues,
        setPrintingFormValues, 
    } = props

    const handleChangeFormValues = (e) => {
        setPrintingFormValues({
            ...printingFormValues,
            [e.target.name]: e.target.value
        })
    }

    const handleCreatePrinting = (e) => {
        e.preventDefault()
        createPrinting(printingFormValues)
    }

    const handleUpdatePrinting = (e) => {
        e.preventDefault()
        updatePrinting(printingFormValues)
    }
    
    const handleDeletePrinting = (e) => {
        e.preventDefault()
        deletePrinting(printingFormValues)
    }

    return (<div className='printingForm'>
        <h3>New Printing</h3>
        <form>
            <label>Name</label>
            <input 
                printing='text'
                name='printing_name'
                value={printingFormValues.printing_name}
                onChange={handleChangeFormValues}
            />
            <label>Parent</label>
            <select name='printing_parent_id' value={printingFormValues.printing_parent_id} onChange={handleChangeFormValues}>
                <option value={null}>--Select Parent--</option>
                {printings.map(printing => <option value={printing.printing_id}>{printing.printing_name}</option>)}
            </select>
            <div className='buttons'>
                {createPrinting ? <Button onClick={handleCreatePrinting}>Create</Button> : <></>}
                {updatePrinting ? <Button onClick={handleUpdatePrinting}>Update</Button> : <></>}
                {deletePrinting ? <Button onClick={handleDeletePrinting}>Delete</Button> : <></>}
                <Button onClick={toggleForm}>Cancel</Button>
            </div>
        </form>
    </div>)
}

export default PrintingForm
