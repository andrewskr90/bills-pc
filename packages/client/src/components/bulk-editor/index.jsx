import React from 'react'
import Banner from '../../layouts/banner/index.jsx'
import BulkSplitForm from '../bulk-form/components/bulk-split-form/index.jsx'
import { useNavigate } from 'react-router-dom'

const BulkEditor = (props) => {
    const { 
        initialSplitValues, 
        addSplitToTransaction, 
        referenceData, 
        updateSplitInBulkValues, 
        purchaseValues 
    } = props
    const navigate = useNavigate()
    return (
        <div className='page'>
            <Banner 
                titleText={'Add Bulk Split'} 
                handleClickBackArrow={() => navigate(-1)} 
            />
            <BulkSplitForm
                initialSplitValues={initialSplitValues}
                addSplitToTransaction={addSplitToTransaction}
                referenceData={referenceData}
                updateSplitInBulkValues={updateSplitInBulkValues}
                purchaseValues={purchaseValues}
            />
        </div>
    )
}

export default BulkEditor
