import React, { useEffect, useState } from 'react'
import './assets/index.less'
import SplitLabelForm from './components/split-label-form/index.jsx'
import SplitLabelsTable from './components/split-labels-table/index.jsx'
import { useParams, useNavigate } from 'react-router-dom'
import { initialSplitLabelFormValues } from '../../../../data/initialData'
import Button from '../../../buttons/text-button/index.jsx'

const BulkSplitForm = (props) => {
    const { 
        referenceData, 
        updateSplitInBulkValues, 
        initialSplitValues,
        addSplitToTransaction,
        purchaseValues
    } = props
    const [splitValues, setSplitValues] = useState(initialSplitValues)
    const [addLabelToggled, setAddLabelToggled] = useState(false)
    const [labelToUpdateIdx, setLabelToUpdateIdx] = useState(null)
    const [updateLabelToggled, setUpdateLabelToggled] = useState(false)
    const [countWarning, setCountWarning] = useState(false)
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (params['idx']) {
            if (purchaseValues.bulkSplits.length > params['idx']) {
                setSplitValues(purchaseValues.bulkSplits[params['idx']])
            } else navigate(-1)
        }
    }, [])

    const handleChangeSplitValues = (e) => {
        let value = e.target.value
        setCountWarning('')
        if (e.target.name === 'estimate') {
            value = e.target.checked
        } else if (e.target.name === 'count') {
            if (!parseInt(e.target.value)) setCountWarning('Whole number required.')
            else value = parseInt(e.target.value)
        } else if (e.target.name === 'rate') {
            value = parseFloat(e.target.value)
        }
        setSplitValues({
            ...splitValues,
            [e.target.name]: value
        })
    }

    const handleUpdateSplit = (e) => {
        e.preventDefault()
        updateSplitInBulkValues(splitValues, params['idx'])
        setSplitValues(initialSplitValues)
    }

    const toggleAddLabel = () => {
        setAddLabelToggled(!addLabelToggled)
    }

    const toggleUpdateSplitLabel = () => {
        setUpdateLabelToggled(!updateLabelToggled)
    }

    const selectLabelToUpdate = (idx) => {
        setLabelToUpdateIdx(idx)
        toggleUpdateSplitLabel()
    }

    const addLabelToSplitValues = (splitLabel) => {
        const adjustedLabels = [...splitValues.labels]
        adjustedLabels.push(splitLabel)
        setSplitValues({
            ...splitValues,
            labels: adjustedLabels
        })
        toggleAddLabel()
    }

    const updateLabelInSplitValues = (updatedLabel, updatedIdx) => {
        const adjustedLabels = splitValues.labels.map((label, j) => {
            if (j === updatedIdx) return updatedLabel
            return label
        })

        setSplitValues({
            ...splitValues,
            labels: adjustedLabels
        })
        toggleUpdateSplitLabel()
    }

    const handleAddSplitToPurchase = (e) => {
        e.preventDefault()
        addSplitToTransaction(splitValues)
    }

    const isPurchaseBulk = () => Object.keys(splitValues).find(key => key === 'rate')

    return (<div className='addSplit'>
        {!addLabelToggled && !updateLabelToggled ? <>
            <form>
                <div className='row'>
                    <h2>Labels</h2>
                </div>
                <SplitLabelsTable
                    referenceData={referenceData} 
                    labels={splitValues.labels} 
                    selectLabelToUpdate={selectLabelToUpdate}
                    toggleAddLabel={toggleAddLabel} 
                />
                <div className='row'>
                    <Button className='addLabel' onClick={toggleAddLabel} variation='secondary'>+ Label</Button>
                </div>
                <div className='row'>
                    {isPurchaseBulk() ? <>
                        <div className='labelInput rate' style={{ width: '30%' }}>
                            <label>Rate</label>
                            <input 
                                name='rate'
                                type='number'
                                step='0.001'
                                value={splitValues.rate}
                                onChange={handleChangeSplitValues}
                            />
                        </div>
                    </> : <></>}
                    <div className='labelInput count' style={{ width: '40%' }}>
                        <label>Count</label>
                        <input 
                            name='count'
                            value={splitValues.count}
                            onChange={handleChangeSplitValues}
                        />
                    </div>
                    <div className='labelInput estimate' style={{ width: '20%' }}>
                        <label>Estimate</label>
                        <input 
                            type='checkbox'
                            name='estimate'
                            checked={splitValues.estimate}
                            onChange={handleChangeSplitValues}
                        />
                    </div>
                </div>
                <div className='row'>
                    <Button 
                        variation='secondary'
                        onClick={addSplitToTransaction ? handleAddSplitToPurchase : handleUpdateSplit}
                    >{addSplitToTransaction ? 'Confirm' : 'Update'}</Button>
                </div>
            </form>
        </> : <>
            {addLabelToggled ? <>
                <SplitLabelForm 
                    referenceData={referenceData} 
                    addLabelToSplitValues={addLabelToSplitValues} 
                    toggleAddLabel={toggleAddLabel} 
                    initialSplitLabelFormValues={initialSplitLabelFormValues}
                    splitValues={splitValues}
                />
            </> : <></>}
            {updateLabelToggled ? <>
                <SplitLabelForm 
                    referenceData={referenceData} 
                    selectLabelToUpdate={selectLabelToUpdate} 
                    initialSplitLabelFormValues={splitValues.labels.find((l, idx) => idx ===labelToUpdateIdx)}
                    updateLabelInSplitValues={updateLabelInSplitValues}
                    labelToUpdateIdx={labelToUpdateIdx}
                    splitValues={splitValues}
                    toggleUpdateSplitLabel={toggleUpdateSplitLabel}
                />
            </> : <></>}
        </>}

    </div>)
}

export default BulkSplitForm
