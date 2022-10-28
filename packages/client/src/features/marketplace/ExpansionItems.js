import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ExpansionItem from './ExpansionItem'
import { calcItemMarketData } from '../../utils/market'

const ExpansionItems = (props) => {
    const { marketData } = props
    const [expansionItems, setExpansionItems] = useState([])

    const selectedSetId = useParams()['setId']

    const sortMarketSetItemsCB = (a, b) => {
        const currentSet = marketData.sets.filter(set => set.id === selectedSetId)[0]
        if (currentSet.sort.value === 'name') {
            if (a.name === b.name) return 0
            if (a.name === null) return 1
            if (b.name === null) return -1
            if (currentSet.sort.direction === 'asc') { 
                if (a.name.toLowerCase() > b.name.toLowerCase()) return 1
                else return -1
            } else {
                if (a.name.toLowerCase() < b.name.toLowerCase()) return 1
                else return -1
            }
        } else if (currentSet.sort.value === 'marketValue') {
            if (a.marketValue === b.marketValue) return 0
            if (a.marketValue === null) return 1
            if (b.marketValue === null) return -1
            if (currentSet.sort.direction === 'desc') { 
                return Math.abs(b.marketValue) - Math.abs(a.marketValue)
            } else {
                return Math.abs(a.marketValue) - Math.abs(b.marketValue)
            }
        } else if (currentSet.sort.value === 'percentChange') {
            if (a.percentChange === b.percentChange) return 0
            if (a.percentChange === null) return 1
            if (b.percentChange === null) return -1
            if (currentSet.sort.direction === 'desc') {
                return Math.abs(b.percentChange) - Math.abs(a.percentChange)
            } else {
                return Math.abs(a.percentChange) - Math.abs(b.percentChange)
            }

        }
    }    

    const matchSetToId = (marketDataSets, targetSetId) => {
        const matchedSet = marketDataSets.filter(set => set.id == targetSetId)[0]
        return matchedSet
    }

    const filterExpansionItems = (expansionItems) => {
            return expansionItems.filter(item => {
                let includeItem = false
                if (item.market_prices !== null) {
                    // includeItem = true
                    if (marketData.filters.length > 0) {
                        marketData.filters.forEach(filter => {
                            // check item type filters
                            if (Object.keys(filter)[0] === 'itemType') {
                                if (filter.itemType === 'Card') {
                                    if (item.card_id) {
                                        includeItem = true
                                    }
                                } else {
                                    if (item.product_id) {
                                        includeItem = true
                                    }
                                }
                            }
                            //check rarity filters
                            if (Object.keys(filter)[0] === 'rarity') {
                                if (item.rarity === filter['rarity']) {
                                    includeItem = true
                                }
                            }
                        })
                    } else {
                        includeItem = true
                    }
                }
                return includeItem
            })
    }

    const applyMarketData = (itemsArray) => {
        return itemsArray.map((item, idx) => {
            const itemMarketData = calcItemMarketData(item.market_prices)
            const itemValue = itemMarketData.prices.latest
            const percentChange = itemMarketData.changes[marketData.dateRange]
            return {
                ...item,
                formattedPrices: itemMarketData,
                marketValue: itemValue,
                percentChange: percentChange
            }
        })
    }

    useEffect(() => {
        const targetSet = matchSetToId(marketData.sets, selectedSetId)
        const filteredItems = filterExpansionItems(targetSet.items)
        const marketPricesAdded = applyMarketData(filteredItems) 
        const sortedItems = marketPricesAdded.sort(sortMarketSetItemsCB)
        setExpansionItems(sortedItems)
    }, [marketData])

    return (<div className='expansionItems'>
        {expansionItems.map(item => <ExpansionItem marketData={marketData} item={item} />)}
    </div>)
}

export default ExpansionItems