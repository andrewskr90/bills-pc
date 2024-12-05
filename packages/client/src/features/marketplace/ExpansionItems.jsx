import React, { useEffect, useState } from 'react'
import Toolbar from '../../layouts/toolbar/index.jsx'
import ItemContainer from '../../components/item-container/index.jsx'
import Item from '../../components/item/index.jsx'
import BillsPcService from '../../api/bills-pc'
import { useLocation, useNavigate } from 'react-router-dom'
import { buildParams } from '../../utils/location/index.js'
import PageSelection from '../../components/page-selection/index.jsx'

const ExpansionItems = (props) => {
    const { referenceData, setReferenceData, selectedSetId, handleSelectItem, countConfig, allowSelectPrinting } = props
    const [items, setItems] = useState([])
    const [expansion, setExpansion] = useState()
    const [isGrid, setIsGrid] = useState(false)
    const [count, setCount] = useState()

    const sortKey = 'itemSort'
    const filterKey = 'market'
    const location = useLocation()
    const navigate = useNavigate()
    
    useEffect(() => {
        (async () => {
            let expansionid
            await BillsPcService.getSetsV2({ params: { set_v2_id: selectedSetId } })
                .then(res => {
                    expansionid = res.data.expansions[0].set_v2_id
                    setExpansion(res.data.expansions[0])
                })
                .catch(err => console.log(err))
            const params = buildParams(location)
            const includeprintings = true
            const direction = params.direction ? params.direction : undefined
            await BillsPcService.getItems({ params: { ...params, expansionid, includeprintings, direction } })
                .then(res => {
                    setCount(res.data.count)
                    setItems(res.data.items)
                    if (res.data.count === 0) navigate(location.pathname)
                })
                .catch(err => console.log(err))
        })()
    }, [location.search])

    return (
        <>
            <div className='title'>
                <h3>{expansion ? expansion.set_v2_name : <>...loading</>}</h3>
                <p>Market Values</p>
            </div>
            <Toolbar
                filterKey={filterKey} 
                sortKey={sortKey}
                viewToggleRowGrid={true}
                referenceData={referenceData}
                setReferenceData={setReferenceData}
                isGrid={isGrid}
                setIsGrid={setIsGrid}
                defaultSortDirection='asc'
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
                                isGrid={isGrid}
                                allowSelectPrinting={allowSelectPrinting}
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