import React from 'react'
import MarketplaceItem from './MarketplaceItem'
import marketplaceData from '../../data/fake-marketplace-data'
import './assets/marketplace.less'
import { select } from '../../../../service/middleware/QueueQueries/users'

const Marketplace = (props) => {
    const { marketData } = props
    const selectedSet = {
        id: marketData.selected_set_id,
        name: marketData.selected_set_name
    }
    return (<div className='marketplace'>
        {marketData.sets.filter(set => set.id === marketData.selected_set_id)[0].items
            .map(item => <MarketplaceItem item={item} selectedSet={selectedSet} />)}
        {/* {marketplaceData.map(item => {
            return <MarketplaceItem item={item} />
        })} */}
    </div>)
}

export default Marketplace