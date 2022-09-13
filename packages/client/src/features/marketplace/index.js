import React from 'react'
import MarketplaceItem from './MarketplaceItem'
import marketplaceData from '../../data/fake-marketplace-data'
import './assets/marketplace.less'

const Marketplace = (props) => {
    return (<div className='marketplace'>
        {marketplaceData.map(item => {
            return <MarketplaceItem item={item} />
        })}
    </div>)
}

export default Marketplace