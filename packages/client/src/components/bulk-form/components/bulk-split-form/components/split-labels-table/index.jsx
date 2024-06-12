import React from 'react'
import SplitLabel from '../split-label/index.jsx'


const SplitLabelsTable = (props) => {
    const { labels, referenceData, selectLabelToUpdate } = props

    return (<div className='splitLabelsTable'>
        {labels.map((splitLabel, idx) => {
            
            return <>
                {idx !== 0 ? <h3 style={{ width: '90%' }}>OR</h3> : <></>}
                <SplitLabel key={idx} referenceData={referenceData} splitLabel={splitLabel} selectLabelToUpdate={selectLabelToUpdate} labelIndex={idx} />
            </>
        })}
    </div>)
}

export default SplitLabelsTable
