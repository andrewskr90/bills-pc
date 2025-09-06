import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { buildQueryParams, buildParamString } from '../../utils/location'
import ExpansionsMarketplace from '../../features/marketplace/ExpansionsMarketplace'
import ExpansionItems from '../../features/marketplace/ExpansionItems'

const AddItemExpansion = (props) => {
    const { referenceData, setReferenceData, countConfig } = props
    const location = useLocation()
    const queryParams = buildQueryParams(location)
    const navigate = useNavigate()

    return (
        !queryParams.expansionid ? (
            <ExpansionsMarketplace
                handleSelectSet={(id) => {
                    queryParams.expansionid = id
                    queryParams.page = '1'
                    navigate(location.pathname + buildParamString(queryParams))
                }}
                referenceData={referenceData}
                setReferenceData={setReferenceData}
            />
        ) : (
            <>
                <button onClick={() => {
                    delete queryParams.expansionid
                    delete queryParams.page
                    navigate(location.pathname + buildParamString(queryParams))
                }}>clear set</button>
                <ExpansionItems
                    selectedSetId={queryParams.expansionid}
                    referenceData={referenceData} 
                    setReferenceData={setReferenceData}
                    countConfig={countConfig} 
                    allowSelectPrinting={true}
                    allowSelectCondition={true}
                />
            </>
        )
    )
}

export default AddItemExpansion
