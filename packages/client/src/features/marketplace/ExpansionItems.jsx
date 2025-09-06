import React, { useEffect, useState } from 'react'
import Toolbar from '../../layouts/toolbar/index.jsx'
import ItemContainer from '../../components/item-container/index.jsx'
import Item from '../../components/item/index.jsx'
import BillsPcService from '../../api/bills-pc'
import { useLocation, useNavigate } from 'react-router-dom'
import { buildQueryParams } from '../../utils/location/index.js'
import PageSelection from '../../components/page-selection/index.jsx'

const ExpansionItems = (props) => {
    const { referenceData, setReferenceData, selectedSetId, handleSelectItem, countConfig, allowSelectPrinting, allowSelectCondition } = props
    const [items, setItems] = useState([])
    const [expansion, setExpansion] = useState()
    const [count, setCount] = useState()
    const filterConfig = { itemType: ['card', 'product'] }

    const sortKey = 'itemSort'
    const location = useLocation()
    const navigate = useNavigate()
    const queryParams = buildQueryParams(location)

    useEffect(() => {
        (async () => {
            await BillsPcService.getSetsV2({ params: { set_v2_id: selectedSetId } })
                .then(res => {
                    setExpansion(res.data.expansions[0])
                })
                .catch(err => console.log(err))
            await BillsPcService.getItems({ params: { ...queryParams } })
                .then(res => {
                    setCount(res.data.count)
                    setItems(res.data.items)
                    if (res.data.count === 0) navigate(location.pathname)
                })
                .catch(err => console.log(err))
        })()
    }, [queryParams.expansionid, queryParams.page, queryParams.direction])

    return (
        <>
            <div className='title'>
                <h3>{expansion ? expansion.set_v2_name : <>...loading</>}</h3>
                <p>Market Values</p>
            </div>
            <Toolbar
                sortKey={sortKey}
                referenceData={referenceData}
                setReferenceData={setReferenceData}
                viewToggleRowGrid={true}
                defaultSortDirection='asc'
                filterConfig={filterConfig}
            />
            {items.length > 0
            ?
            <>
                <PageSelection location={location} count={count} />
                <ItemContainer>
                    {items.map(item => {
                            return <Item 
                                key={item.id} 
                                referenceData={referenceData} 
                                item={item} 
                                handleSelectItem={handleSelectItem} 
                                countConfig={countConfig} 
                                allowSelectPrinting={allowSelectPrinting}
                                allowSelectCondition={allowSelectCondition}
                            />
                        })
                    }
                    <PageSelection location={location} count={count} />
                </ItemContainer>
            </>
            :
            <div className='loadingGradient loadingExpansionItems'>Loading Expansion Items...</div>}
        </>
    )
}

export default ExpansionItems