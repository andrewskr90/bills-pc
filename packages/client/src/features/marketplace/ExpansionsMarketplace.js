import React from 'react'
import Sort from '../../components/Sort'
import Expansion from './Expansion'
import RangeSelectors from './RangeSelectors'

const ExpansionsMarketplace = (props) => {
    const { referenceData, setReferenceData } = props
    const sortKey = 'setSort'
    const sortMarketSetsCB = (a, b) => {
        if (referenceData[sortKey].value === 'topTenAverageToday') {
            if (a.topTenAverage) {
                if (a.topTenAverage.today === b.topTenAverage.today) return 0
                if (a.topTenAverage.today === null) return 1
                if (b.topTenAverage.today === null) return -1
                if (referenceData[sortKey].direction === 'desc') { 
                    return b.topTenAverage.today - a.topTenAverage.today
                } else {
                    return a.topTenAverage.today - b.topTenAverage.today
                }
            }
        } else if (referenceData[sortKey].value === 'topTenPercentChange') {
            if (a.topTenPercentChange) {
                if (a.topTenPercentChange[referenceData.dateRange] === b.topTenPercentChange[referenceData.dateRange]) return 0
                if (a.topTenPercentChange[referenceData.dateRange] === null) return 1
                if (b.topTenPercentChange[referenceData.dateRange] === null) return -1
                if (referenceData[sortKey].direction === 'desc') {
                    return Math.abs(b.topTenPercentChange[referenceData.dateRange]) - Math.abs(a.topTenPercentChange[referenceData.dateRange])
                } else {
                    return Math.abs(a.topTenPercentChange[referenceData.dateRange]) - Math.abs(b.topTenPercentChange[referenceData.dateRange])
                }
            }
        } else if (referenceData[sortKey].value === 'name') {
            if (a.set_v2_name === b.set_v2_name) return 0
            if (a.set_v2_name === null) return 1
            if (b.set_v2_name === null) return -1
            if (referenceData[sortKey].direction === 'asc') { 
                if (a.set_v2_name.toLowerCase() > b.set_v2_name.toLowerCase()) return 1
                else return -1
            } else {
                if (a.set_v2_name.toLowerCase() < b.set_v2_name.toLowerCase()) return 1
                else return -1
            }
        } else if (referenceData[sortKey].value === 'release_date') {
            if (a.set_v2_release_date === b.set_v2_release_date) return 0
            if (a.set_v2_release_date === null) return 1
            if (b.set_v2_release_date === null) return -1
            if (referenceData[sortKey].direction === 'desc') { 
                return Date.parse(b.set_v2_release_date) - Date.parse(a.set_v2_release_date)
            } else {
                return Date.parse(a.set_v2_release_date) - Date.parse(b.set_v2_release_date)
            }
        }
    }

    return (<div className='expansionsMarketplace'>
        <div className='title'>
            <h3>Pokemon Expansions</h3>
            {referenceData.topTenCalled
            ?
            <p>Top 10 Card Averages</p>
            :
            <p className='loadingGradient'>Loading Top 10 Card Averages...</p>}
        </div>
        <div className='toolbar'>
            <RangeSelectors referenceData={referenceData} setReferenceData={setReferenceData} />
            <Sort dataObject={referenceData} setDataObject={setReferenceData} sortKey={sortKey} />
        </div>
        <div className='expansions'>
            {referenceData.sets.sort(sortMarketSetsCB).map(referenceDataExpansion => {
                return <Expansion referenceData={referenceData} referenceDataExpansion={referenceDataExpansion} />
            })}
        </div>
    </div>)
}

export default ExpansionsMarketplace
