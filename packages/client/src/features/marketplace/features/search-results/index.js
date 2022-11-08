import React from 'react'
import ExpansionItem from '../../ExpansionItem'
import { applyMarketChanges } from '../../../../utils/market'
import '../../assets/marketplace.less'

const SearchResults = (props) => {
    const { referenceData, setReferenceData } = props

    return (<div className='searchResults expansionItems'>
        {applyMarketChanges(referenceData.marketSearchResults).map(result => {
            return <ExpansionItem referenceData={referenceData} item={result} />
        })}
    </div>)
}

export default SearchResults
