import React from 'react'
import { useParams, useLocation, Routes, Route, useNavigate} from 'react-router-dom'
import PreviousRoutes from '../../layouts/previous-routes'
import ExpansionItemInfo from './ExpansionItemInfo'
import ExpansionItems from './ExpansionItems'

const ExpansionItemsMarketplace = (props) => {
    const {
        referenceData,
        setReferenceData,
        selectedSetIdProp
    } = props
    const location = useLocation()
    const selectedSetId = useParams()['setId'] || selectedSetIdProp
    const navigate = useNavigate()

    const handleSelectItem = (item) => {
        const expansionId = item.set.id
        navigate(`/market/${expansionId}/${item.id}`)
    }

    return (<div className='expansionItemsMarketplace'>
        <PreviousRoutes location={location} referenceData={referenceData} />
        <Routes>
            <Route 
                path='/'
                element={<ExpansionItems
                    referenceData={referenceData}
                    setReferenceData={setReferenceData}
                    selectedSetId={selectedSetId}
                    handleSelectItem={handleSelectItem}
                 />}
            />
            <Route 
                path='/:itemId'
                element={<ExpansionItemInfo referenceData={referenceData} setReferenceData={setReferenceData} />}
            />
        </Routes>
    </div>)
}

export default ExpansionItemsMarketplace
