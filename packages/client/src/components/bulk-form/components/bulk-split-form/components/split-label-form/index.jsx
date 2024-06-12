import React, { useState } from 'react'
import './assets/index.less'
import Button from '../../../../../buttons/text-button/index.jsx'

const SplitLabelForm = (props) => {
    const { 
        toggleAddLabel, 
        addLabelToSplitValues, 
        referenceData, 
        toggleUpdateSplitLabel, 
        initialSplitLabelFormValues,
        labelToUpdateIdx,
        updateLabelInSplitValues,
        splitValues
    } = props
    const [splitLabelFormValues, setSplitLabelFormValues] = useState(initialSplitLabelFormValues)

    const handleConfirmLabel = (e) => {
        e.preventDefault()
        addLabelToSplitValues(splitLabelFormValues)
    }

    const handleUpdateLabel = (e) => {
        e.preventDefault()
        updateLabelInSplitValues(splitLabelFormValues, labelToUpdateIdx)
    }

    const handleChangeSplitLabelValues = (e, idx) => {
        let updatedSelectArray = [...splitLabelFormValues[e.target.name]]
        if (e.target.value === '--Select--') updatedSelectArray.splice(idx, 1)
        else if (idx === updatedSelectArray.length -1) {
            updatedSelectArray.splice(updatedSelectArray.length-1, 0, e.target.value)
        } else {
            updatedSelectArray = updatedSelectArray.map((value, j) => {
                if (idx === j) return e.target.value
                return value
            })
        }
        setSplitLabelFormValues({
            ...splitLabelFormValues,
            [e.target.name]: updatedSelectArray
        })
    }

    const handleToggleAddLabel = (e) => {
        e.preventDefault()
        toggleAddLabel()
    }

    const handleToggleUpdateSplitLabel = (e) => {
        e.preventDefault()
        toggleUpdateSplitLabel()
    }

    return (<div className='splitLabelForm'>
        <form>
            <div className='row'>
                <h2>Split Form</h2>
            </div>
            {Object.keys(splitLabelFormValues).map(key => {
                let keyDisplay
                let optionValueKey
                let optionNameKey
                if (key === 'rarity') {
                    keyDisplay = 'Rarities'
                    optionValueKey = 'rarity_id'
                    optionNameKey = 'rarity_name'
                }
                if (key === 'type') {
                    keyDisplay = 'Types'
                    optionValueKey = 'type_id'
                    optionNameKey = 'type_name'
                }
                if (key === 'printing') {
                    keyDisplay = 'Printings'
                    optionValueKey = 'printing_id'
                    optionNameKey = 'printing_name'
                }
                if (key === 'set') {
                    keyDisplay = 'Expansions'
                    optionValueKey = 'set_v2_id'
                    optionNameKey = 'set_v2_name'
                }
                console.log(referenceData)
                return <div className='row'>
                    <div className='labelInput'>
                        <label>{keyDisplay}</label>
                        {splitLabelFormValues[key].map((value, idx) => {

                            return <select key={idx} name={key} value={splitLabelFormValues[key][idx]} onChange={(e) => handleChangeSplitLabelValues(e, idx)}>
                                {[ { [optionValueKey]: null, [optionNameKey]: '--Select--' }, ...referenceData.bulk[key]].map(option => {
                                    return <option value={option[optionValueKey]}>{option[optionNameKey]}</option>
                                })}
                            </select>
                        })}
                    </div>
                </div>
            })}
            <div className='row'>
                <Button color='red' variation='secondary' onClick={toggleAddLabel ? handleToggleAddLabel : handleToggleUpdateSplitLabel}>Cancel</Button>
                <Button variation='secondary' onClick={addLabelToSplitValues ? handleConfirmLabel : handleUpdateLabel}>{addLabelToSplitValues ? 'Confirm' : 'Update'}</Button>
            </div>
        </form>
    </div>)
}

export default SplitLabelForm
