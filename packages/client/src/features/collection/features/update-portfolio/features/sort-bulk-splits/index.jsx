import React, { useEffect } from 'react'
import { Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import ItemContainer from '../../../../../../components/item-container'
import BulkSplit from '../../../../BulkSplit'
import SortBulkSplit from './SortBulkSplit'

const SortBulkSplits = (props) => {
    const { referenceData, portfolio, setPortfolio, setReferenceData } = props
    const navigate = useNavigate()
            
    const selectBulkSplit = (splitId) => {
        navigate(splitId)
    }

    return <div className="page" style={{ position: "relative" }}>
        <Routes>
            <Route path="/" element={
                <ItemContainer>
                    <h3>Bulk</h3>
                    {portfolio.inventory.bulkSplits.map((split, idx) => {
                        return <BulkSplit key={idx} bulkSplit={split} selectBulkSplit={selectBulkSplit} />
                    })}
                </ItemContainer>
            } />
            <Route path="/:bulkId/*" element={<SortBulkSplit portfolio={portfolio} referenceData={referenceData} setReferenceData={setReferenceData} />} />
        </Routes>
    </div>
}

export default SortBulkSplits
