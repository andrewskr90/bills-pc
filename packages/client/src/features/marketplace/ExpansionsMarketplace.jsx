import React, { useEffect, useState } from 'react'
import Toolbar from '../../layouts/toolbar/index.jsx'
import Expansion from './Expansion.jsx'
import { filterExpansions } from '../../utils/filter'
import BillsPcService from '../../api/bills-pc/index.js'
import { buildParams } from '../../utils/location/index.js'
import { useLocation } from 'react-router-dom'
import PageSelection from '../../components/page-selection/index.jsx'

const ExpansionsMarketplace = (props) => {
    const { referenceData, setReferenceData, handleSelectSet } = props
    const sortKey = 'setSort'
    const filterKey = 'expansion'
    const location = useLocation()
    const [expansions, setExpansions] = useState([])
    const [count, setCount] = useState()

    const params = buildParams(location)
    useEffect(() => {
        (async () => {
            await BillsPcService.getSetsV2({ params })
                .then(res => {
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
            filterKey={filterKey} 
            sortKey={sortKey}
            viewRangeSelector={false}
            referenceData={referenceData}
            setReferenceData={setReferenceData}
            defaultSortDirection='desc'
            defaultAttribute='releasedate'
        />
        <PageSelection location={location} count={count} />
        <div className='expansions'>
            {filterExpansions(expansions, referenceData.filter.expansion)
                .map(referenceDataExpansion => {
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
