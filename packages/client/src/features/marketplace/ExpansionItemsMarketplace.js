import React, { useEffect } from 'react'
import { useParams, useLocation, Routes, Route, useNavigate} from 'react-router-dom'
import ItemContainer from '../../components/item-container'
import BillsPcService from '../../api/bills-pc'
import Toolbar from '../../layouts/toolbar'
import PreviousRoutes from '../../layouts/previous-routes'
import ExpansionItemInfo from './ExpansionItemInfo'
import Item from '../../components/item'
import { applyMarketChanges } from '../../utils/market'
import { generateMarketItemSortCB } from '../../utils/sort'
import { filterMarketItems } from '../../utils/filter'

const ExpansionItemsMarketplace = (props) => {
    const {
        referenceData,
        setReferenceData
    } = props
    const location = useLocation()
    const selectedSetId = useParams()['setId']
    const sortKey = 'itemSort'
    const filterKey = 'market'
    const navigate = useNavigate()

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

    const matchSetToId = (marketDataSets, targetSetId) => {
        const matchedSet = marketDataSets.filter(set => set.set_v2_id == targetSetId)[0]
        return matchedSet
    }

    const handleSelectItem = (item) => {
        const expansionId = item.set.id
        const itemId = item.card_id || item.product_id
        navigate(`/market/${expansionId}/${itemId}`)
    }

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
                    />
                    {referenceData.sets.filter(expansion => expansion.set_v2_id === selectedSetId)[0].items.length > 0
                    ?
                    <ItemContainer>
                        {applyMarketChanges(filterMarketItems(matchSetToId(referenceData.sets, selectedSetId).items, referenceData.filter.market))
                            .sort(generateMarketItemSortCB(referenceData, sortKey))
                            .map(item => <Item referenceData={referenceData} item={item} handleSelectItem={handleSelectItem} />)
                        }
                    </ItemContainer>
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
