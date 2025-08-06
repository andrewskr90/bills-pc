import React from 'react'
import ChartJS from 'chart.js/auto'
import { Line } from 'react-chartjs-2'

const MarketplaceChart = (props) => {
    const { id, prices, printing, referenceData } = props
    let rangeKey = referenceData.dateRange
    const itemPercentChange = prices[printing].changes[referenceData.dateRange]

    return (<div className='marketplaceChart'>
        {itemPercentChange
        ?
        <Line 
            datasetIdKey={id}
            data={{
                labels: prices[printing].prices[rangeKey].map(price => price[0]).reverse(),
                datasets: [{
                    id: id,
                    data: prices[printing].prices[rangeKey].map(price => price[1]).reverse(),
                    spanGaps: true,
                    tension: 0.3,
                    radius: 0,
                    borderColor: itemPercentChange > 0 ? 'rgb(0, 200, 0)' : itemPercentChange ? 'rgb(220, 0, 0)' : 'rgb(96, 101, 203)',
                    borderWidth: '2'
                }] 
            }}
            options={{
                layout: {
                    padding: -20
                },
                plugins: {
                    legend: { display: false },
                },
                maintainAspectRatio: false,
                scales: {
                    y: {
                            grid: {
                                display: false,
                                drawBorder: false
                            },
                            ticks: {
                                display: false
                            }
                        },
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            display: false
                        }
                    }
                }
            }}
        />
        :
        <p className='unavailable'>Market Trend Unavailable</p>}
    </div>)
}

export default MarketplaceChart
