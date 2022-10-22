import React from 'react'
import { useNavigate } from 'react-router-dom'
import MinimalPokeball from '../../assets/images/minimal-pokeball.png'

const MarketplaceSet = (props) => {
    const { marketDataSet, marketData } = props
    const navigate = useNavigate()

    let topTenAverage = marketDataSet.topTenAverage.today ? `$${marketDataSet.topTenAverage.today.toFixed(2)}` : ''
    let percentChange
    if (marketDataSet.topTenPercentChange[marketData.dateRange]) {
        if (marketDataSet.topTenPercentChange[marketData.dateRange] > 0) {
            percentChange = `+${marketDataSet.topTenPercentChange[marketData.dateRange].toFixed(2)}%`
        } else {
            percentChange = `${marketDataSet.topTenPercentChange[marketData.dateRange].toFixed(2)}%`
        }
    } else {
        if (marketDataSet.topTenPercentChange[marketData.dateRange] === 0) {
            percentChange = `0%`
        } else {
            percentChange = 'Unavailable'
        }
    }
    // if (marketDataSet.topTenAverage.today) formattedTopTenAverage = marketDataSet.topTenAverage.today.toFixed(2)
    // else formattedTopTenAverage = 'Unavailable'
    // if (marketDataSet.topTenPercentChange[marketData.dateRange]) formattedPercentChange = marketDataSet.topTenPercentChange[marketData.dateRange]
    // else formattedPercentChange = 'Unavailable'

    return (<div 
            className={`marketplaceSet ${marketDataSet.topTenPercentChange[marketData.dateRange] > 0 ? 'up' : marketDataSet.topTenPercentChange[marketData.dateRange] < 0 ? 'down' : ''}`}
            onClick={() => navigate(marketDataSet.id)}
        >
        <div className='setSymbol'>
            <img src={marketDataSet.ptcgio_id ? `https://images.pokemontcg.io/${marketDataSet.ptcgio_id}/symbol.png` : MinimalPokeball} />
        </div>
        <p className='setName'>{marketDataSet.name}</p>
        <div className='valueAndChange'>
            <p className='marketValue'>{topTenAverage}</p>
            <p className='percentChange'>{percentChange}</p>
        </div>

    </div>)
}

export default MarketplaceSet
