import React from 'react'
import { useParams } from 'react-router-dom'
import ExpansionItem from './ExpansionItem'
import { applyMarketChanges } from '../../utils/market'

const ExpansionItems = (props) => {
    const { referenceData, sortKey } = props
    const selectedSetId = useParams()['setId']

    const sortMarketSetItemsCB = (a, b) => {
        if (referenceData[sortKey].value === 'name') {
            if (a.name === b.name) return 0
            if (a.name === null) return 1
            if (b.name === null) return -1
            if (referenceData[sortKey].direction === 'asc') { 
                if (a.name.toLowerCase() > b.name.toLowerCase()) return 1
                else return -1
            } else {
                if (a.name.toLowerCase() < b.name.toLowerCase()) return 1
                else return -1
            }
        } else if (referenceData[sortKey].value === 'marketValue') {
            if (a.marketValue === b.marketValue) return 0
            if (a.marketValue === null) return 1
            if (b.marketValue === null) return -1
            if (referenceData[sortKey].direction === 'desc') { 
                return Math.abs(b.marketValue) - Math.abs(a.marketValue)
            } else {
                return Math.abs(a.marketValue) - Math.abs(b.marketValue)
            }
        } else if (referenceData[sortKey].value === 'percentChange') {
            if (a.formattedPrices.changes[referenceData.dateRange] === b.formattedPrices.changes[referenceData.dateRange]) return 0
            if (a.formattedPrices.changes[referenceData.dateRange] === null) return 1
            if (b.formattedPrices.changes[referenceData.dateRange] === null) return -1
            if (referenceData[sortKey].direction === 'desc') {
                return Math.abs(b.formattedPrices.changes[referenceData.dateRange]) - Math.abs(a.formattedPrices.changes[referenceData.dateRange])
            } else {
                return Math.abs(a.formattedPrices.changes[referenceData.dateRange]) - Math.abs(b.formattedPrices.changes[referenceData.dateRange])
            }

        }
    }    

    const matchSetToId = (marketDataSets, targetSetId) => {
        const matchedSet = marketDataSets.filter(set => set.set_v2_id == targetSetId)[0]
        return matchedSet
    }

    const filterExpansionItems = (expansion) => {
        const expansionItems = expansion.items

        const filterLib = {}
        referenceData.expansionItemFilters.forEach(filter => {
            filterLib[Object.keys(filter)[0]] = true
        })
        let rarityFilterActive
        referenceData.rarities.forEach(rarity => {
            if (filterLib[rarity]) {
                rarityFilterActive = true
            }
        })
        
        return expansionItems.filter(item => {
            let includeItem = false
            if (item.market_prices !== null) {
                if (referenceData.expansionItemFilters.length > 0) {
                    if (item.product_id) {
                        if (filterLib['Product']) {
                            includeItem = true
                        }
                    } else {
                        if (rarityFilterActive) {
                            if (filterLib[item.rarity]) {
                                includeItem = true
                            }
                        } else if (filterLib['Card']) {
                            if (item.card_id) {
                                includeItem = true
                            }
                        }
                    }
                } else {
                    includeItem = true
                }
            }
            return includeItem
        })
    }

    return (<div className='expansionItems'>
        {applyMarketChanges(filterExpansionItems(matchSetToId(referenceData.sets, selectedSetId))).sort(sortMarketSetItemsCB)
            .map(item => <ExpansionItem referenceData={referenceData} item={item} />)}
    </div>)
}

export default ExpansionItems
