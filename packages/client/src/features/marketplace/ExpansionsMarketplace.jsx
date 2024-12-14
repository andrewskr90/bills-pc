import React, { useEffect, useState } from 'react'
import Toolbar from '../../layouts/toolbar/index.jsx'
import Expansion from './Expansion.jsx'
import BillsPcService from '../../api/bills-pc/index.js'
import { buildParams, buildParamString } from '../../utils/location/index.js'
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

    const calcFilterMarketExpansionsConfig = (expansions) => {
        const visitedSeries = {}
        const expansionSeries = []
        expansions.forEach(expansion => {
            if (expansion.set_v2_series) {
                if (!visitedSeries[expansion.set_v2_series]) {
                    visitedSeries[expansion.set_v2_series] = 1
                    expansionSeries.push(expansion.set_v2_series)
                }
            }
        })
        return {
            expansionSeries
        }
    }

    const params = buildParams(location)
    useEffect(() => {
        (async () => {
            await BillsPcService.getExpansionSeries({})
                .then(res => setFilterConfig(calcFilterMarketExpansionsConfig(res.data)))
            await BillsPcService.getSetsV2({ params })
                .then(res => {
                    if (parseInt(params.page) && ((parseInt(params.page)*20) - 20) > res.data.count) {
                        params.page = '1'
                        navigate(location.pathname + buildParamString(params))
                    }
                    setExpansions(res.data.expansions)
                    setCount(res.data.count)
                }).catch(console.log)
        })()
    }, [location.search])
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
