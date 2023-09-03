import React, { useState } from 'react'
import './assets/index.less'
import BulkSplitForm from './components/bulk-split-form'
import Form from '../form'
import BluePencil from '../../assets/BluePencil.png'
import { formatLabel } from './utils'
import { useNavigate } from 'react-router-dom'

const BulkForm = (props) => {
    const { handleSelectBulkSplits, updateBulkSplits, referenceData, initialSplitValues, initialSplitsValues } = props
    const [splits, setSplits] = useState(initialSplitsValues)
    const [addSplitToggled, setAddSplitToggled] = useState(false)
    const [updateSplitToggled, setUpdateSplitToggled] = useState(false)
    const [splitToUpdateIdx, setSplitToUpdateIdx] = useState(0)
    const navigate = useNavigate()

    const countCards = (splits) => {
        let count = 0
        let estimate = false
        splits.forEach(split => {
            if (split.estimate) estimate = true
            count += split.count
        })
        return `${estimate ? '~' : ''}${count}`
    }

    const toggleAddSplit = () => setAddSplitToggled(!addSplitToggled)

    const toggleUpdateSplit = () => setUpdateSplitToggled(!updateSplitToggled)

    const addSplitToBulk = (newSplit) => {
        const adjustedSplits = [...splits, newSplit]
        setSplits(adjustedSplits)
        toggleAddSplit()
    }

    const selectSplitToAdd = () => {
        toggleAddSplit()
    }

    const selectSplitToUpdate = (idx) => {
        setSplitToUpdateIdx(idx)
        toggleUpdateSplit()
    }

    const confirmAddBulk = (e) => {
        e.preventDefault()
        handleSelectBulkSplits(splits)
    }

    const handleUpdateBulkSplits = (e) => {
        e.preventDefault()
        updateBulkSplits(splits)
        navigate(-1)
    }

    const formConfig = {
        rows: [
            {
                elements: [

                    {
                        width: 100,
                        type:'header',
                        title: `${countCards(splits)} Cards`
                    }
                ]
            },
            {
                elements: [
                    {
                        type: 'child',
                        childIndex: 0,
                        width: 100
                    }
                ]
            },
            {
                elements: [
                    {
                        width: 100,
                        type: 'button',
                        title: '+ Split',
                        variation: 'secondary',
                        onClick: selectSplitToAdd
                    }
                ]
            },
            {
                elements: [
                    {
                        width: 50,
                        type: 'button',
                        title: 'Confirm',
                        onClick: handleSelectBulkSplits ? confirmAddBulk : handleUpdateBulkSplits
                    }
                ]
            }
        ]
    }

    const updateSplitInBulkValues = (updatedSplit, updatedIdx) => {
        const adjustedSplits = splits.map((split, j) => {
            if (j === updatedIdx) return updatedSplit
            return split
        })
        setSplits(adjustedSplits)
        toggleUpdateSplit()
    }

    const BulkSplit = (props) => {
        const { split, splitIdx, selectSplitToUpdate } = props   
        const handleEditSplit = (e) => {
            e.preventDefault()
            selectSplitToUpdate(splitIdx)
        }     
        return (<div className='bulkSplit'>
            <h3 className='count'>{`${split.estimate ? '~' : ''}${split.count}`}</h3>
            <p className='labels'>
                {formatLabel(split.labels[0], referenceData.bulk)}
                {split.labels.length > 1 ? ` +${split.labels.length -1} label(s)` : ''}
            </p>
            <div onClick={handleEditSplit} className='edit'>
                <img src={BluePencil} />
            </div>
        </div>)
    }

    const BulkSplitsTable = (props) => {
        const { splits, selectSplitToUpdate } = props
        return (<div className='bulkSplitsTable'>
            {splits.map((split, idx) => {
                return <BulkSplit split={split} splitIdx={idx} selectSplitToUpdate={selectSplitToUpdate} />
            })}
        </div>)
    }

    return (<div className='bulkForm'>
        {!addSplitToggled && !updateSplitToggled ? <>
            <Form config={formConfig}>
                {[
                    <BulkSplitsTable 
                        splits={splits}
                        selectSplitToUpdate={selectSplitToUpdate}
                    />
                ]}
            </Form>
        </> : <>
            {addSplitToggled ? <>
                <BulkSplitForm 
                    referenceData={referenceData} 
                    addSplitToBulk={addSplitToBulk} 
                    initialSplitValues={initialSplitValues}
                />
            </> : <></>}
            {updateSplitToggled ? <>
                <BulkSplitForm 
                    referenceData={referenceData} 
                    updateSplitInBulkValues={updateSplitInBulkValues} 
                    splitToUpdateIdx={splitToUpdateIdx}
                    initialSplitValues={splits.find((split, idx) => idx === splitToUpdateIdx)}
                />
            </> : <></>}
        </>}
    </div>)
}

export default BulkForm
