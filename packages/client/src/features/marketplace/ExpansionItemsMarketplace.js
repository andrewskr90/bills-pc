import React, { useEffect } from 'react'
import { useParams, useLocation, Routes, Route, useNavigate} from 'react-router-dom'
import ExpansionItems from './ExpansionItems'
import BillsPcService from '../../api/bills-pc'
import Toolbar from '../../layouts/toolbar'
import PreviousRoutes from '../../layouts/previous-routes'
import ExpansionItemInfo from './ExpansionItemInfo'

const ExpansionItemsMarketplace = (props) => {
    const {
        referenceData,
        setReferenceData
    } = props
    const location = useLocation()
    const selectedSetId = useParams()['setId']
    const sortKey = 'itemSort'
    const filterKey = 'market'

    useEffect(() => {
        if (referenceData.sets.filter(expansion => expansion.set_v2_id === selectedSetId)[0].items.length === 0) {
            (async () => {
                await BillsPcService.getMarketPrices({ set_v2_id: selectedSetId})
                    .then(res => {
                        setReferenceData({
                            ...referenceData,
                            sets: referenceData.sets.map(expansion => {
                                if (expansion.set_v2_id === selectedSetId) {
                                    return {
                                        ...expansion,
                                        items: res.data
                                    }
                                } else {
                                    return expansion
                                }
                            })
                        })
                    })
                    .catch(err => console.log(err))
            })()
        }
    }, [])

    return (<div className='expansionItemsMarketplace'>
        <PreviousRoutes location={location} referenceData={referenceData} />
        <Routes>
            <Route 
                path='/'
                element={<>
                    <div className='title'>
                        <h3>{ referenceData.sets.filter(expansion => expansion.set_v2_id === selectedSetId)[0].set_v2_name }</h3>
                        <p>Market Values</p>
                    </div>
                    <Toolbar 
                        filterKey={filterKey} 
                        sortKey={sortKey}
                        viewRangeSelector={true}
                        referenceData={referenceData}
                        setReferenceData={setReferenceData}
                        dataObject={referenceData}
                        setDataObject={setReferenceData}
                    />
                    {referenceData.sets.filter(expansion => expansion.set_v2_id === selectedSetId)[0].items.length > 0
                    ?
                    <ExpansionItems referenceData={referenceData} sortKey={sortKey} />
                    :
                    <div className='loadingGradient loadingExpansionItems'>Loading Expansion Items...</div>}
                </>}
            />
            <Route 
                path='/:itemId'
                element={<ExpansionItemInfo referenceData={referenceData} setReferenceData={setReferenceData} />}
            />
        </Routes>
    </div>)
}

export default ExpansionItemsMarketplace
