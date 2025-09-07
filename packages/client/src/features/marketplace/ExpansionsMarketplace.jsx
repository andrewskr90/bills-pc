import React, { useEffect, useState } from 'react'
import Toolbar from '../../layouts/toolbar/index.jsx'
import Expansion from './Expansion.jsx'
import BillsPcService from '../../api/bills-pc/index.js'
import { buildQueryParams, buildParamString } from '../../utils/location/index.js'
import { useLocation, useNavigate } from 'react-router-dom'
import PageSelection from '../../components/page-selection/index.jsx'

const ExpansionsMarketplace = (props) => {
    const { referenceData, setReferenceData, handleSelectSet } = props
    const sortKey = 'setSort'
    const location = useLocation()
    const [expansions, setExpansions] = useState([])
    const [count, setCount] = useState()
    const [filterConfig, setFilterConfig] = useState()
    const navigate = useNavigate()

    const queryParams = buildQueryParams(location)
    useEffect(() => {
        (async () => {
            await BillsPcService.getExpansionSeries({})
                .then(res => setFilterConfig({ expansionSeries: res.data }))
            await BillsPcService.getSetsV2({ params: queryParams })
                .then(res => {
                    if (parseInt(queryParams.page) && ((parseInt(queryParams.page)*20) - 20) > res.data.count) {
                        queryParams.page = '1'
                        navigate(location.pathname + buildParamString(queryParams))
                    }
                    setExpansions(res.data.expansions)
                    setCount(res.data.count)
                }).catch(console.log)
        })()
    }, [queryParams.attribute, queryParams.page, queryParams.direction])
    return (<div className='expansionsMarketplace'>
        <div className='title'>
            <h3>Browse By Expansion</h3>
        </div>
        <Toolbar
            sortKey={sortKey}
            viewRangeSelector={false}
            referenceData={referenceData}
            setReferenceData={setReferenceData}
            defaultSortDirection='desc'
            defaultAttribute='releasedate'
            filterConfig={filterConfig}
        />
        <PageSelection location={location} count={count} />
        <div className='expansions'>
            {expansions.map(referenceDataExpansion => {
                    return <Expansion 
                        handleSelectSet={handleSelectSet}
                        referenceData={referenceData} 
                        referenceDataExpansion={referenceDataExpansion} 
                    />
            })}
            <PageSelection location={location} count={count} />
        </div>
    </div>)
}

export default ExpansionsMarketplace
