import React from 'react'
import BluePencil from '../../../../../../assets/BluePencil.png'
import './assets/index.less'
import { formatLabel } from '../../../../utils'

const SplitLabel = (props) => {
    const { referenceData, splitLabel, selectLabelToUpdate, labelIndex } = props

    const handleEditLabel = () => {
        selectLabelToUpdate(labelIndex)
    }

    return (<div className='splitLabel'>
        <p>{formatLabel(splitLabel, referenceData.bulk)}</p>
        <div onClick={handleEditLabel} className='edit'>
            <img src={BluePencil} />
        </div>
    </div>)
}

export default SplitLabel
