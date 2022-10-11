import React from 'react'

const MarketplaceSet = (props) => {
    const { marketDataSet, marketData } = props

    let percentChange = marketDataSet.topTenPercentChange[marketData.dateRange]
    return (<div className={`marketDataSet ${percentChange > 0 ? 'up' : percentChange < 0 ? 'down' : ''}`}>
        <p>{marketDataSet.name}</p>
        <div className='valueAndChange'>
            <p>{marketDataSet.topTenAverage.today}</p>
            <p>{percentChange}</p>
        </div>

    </div>)
}

export default MarketplaceSet
