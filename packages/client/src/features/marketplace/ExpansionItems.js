import React from 'react'
import { useParams } from 'react-router-dom'
import ExpansionItem from './ExpansionItem'
import { applyMarketChanges } from '../../utils/market'
import { generateMarketItemSortCB } from '../../utils/sort'
import { filterMarketItems } from '../../utils/filter'

const ExpansionItems = (props) => {
    const { referenceData, sortKey } = props
    const params = useParams()
    const selectedSetId = params['setId']

    const matchSetToId = (marketDataSets, targetSetId) => {
        const matchedSet = marketDataSets.filter(set => set.set_v2_id == targetSetId)[0]
        return matchedSet
    }

    return (<div className='expansionItems'>
        {applyMarketChanges(filterMarketItems(matchSetToId(referenceData.sets, selectedSetId).items, referenceData.filter.market))
            .sort(generateMarketItemSortCB(referenceData, sortKey))
            .map(item => <ExpansionItem referenceData={referenceData} item={item} />)}
    </div>)
}

export default ExpansionItems
