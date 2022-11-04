import React from 'react'
import ChartJS from 'chart.js/auto'
import { Line } from 'react-chartjs-2'

const MarketplaceChart = (props) => {
    const { item, referenceData } = props
    const itemId = item.card_id || item.product_id
    let rangeKey = referenceData.dateRange
    const itemPercentChange = item.formattedPrices.changes[referenceData.dateRange]

    return (<div className='marketplaceChart'>
        <Line 
            datasetIdKey={itemId}
            data={{
                labels: item.formattedPrices.prices[rangeKey].map(price => price[0]).reverse(),
                datasets: [{
                    id: itemId,
                    data: item.formattedPrices.prices[rangeKey].map(price => price[1]).reverse(),
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
    </div>)
}

export default MarketplaceChart
