import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { buildParams, buildParamString } from '../../utils/location'
import ExpansionsMarketplace from '../../features/marketplace/ExpansionsMarketplace'
import ExpansionItems from '../../features/marketplace/ExpansionItems'

const AddItemExpansion = (props) => {
    const { referenceData, setReferenceData, countConfig } = props
    const location = useLocation()
    const params = buildParams(location)
    const navigate = useNavigate()

    const [selectedExpansion, setSelectedExpansion] = useState(undefined)

    return (
        !params.expansionid ? (
            <ExpansionsMarketplace
                handleSelectSet={(id) => {
                    params.expansionid = id
                    params.page = '1'
                    navigate(location.pathname + buildParamString(params))
                    setSelectedExpansion(id)
                }}
                referenceData={referenceData}
                setReferenceData={setReferenceData}
            />
        ) : (
            <>
                <button onClick={() => setSelectedExpansion(undefined)}>clear set</button>
                <ExpansionItems
                    selectedSetId={selectedExpansion}
                    referenceData={referenceData} 
                    setReferenceData={setReferenceData}
                    countConfig={countConfig} 
                    allowSelectPrinting={true}
                />
            </>
        )
    )
}

export default AddItemExpansion
