import React from "react"
import { Link } from "react-router-dom"
import ItemContainer from "../../../../components/item-container"
const PortfolioAssets = (props) => {
    const { portfolio } = props 

    const compileBulkLabels = (labels) => {
        return labels.map(label => {
            const rarities = []
            const types = []
            const printings = []
            return label.components.map(component => {
                const { rarity_name, type_name, printing_name, set_v2_name } = component
                return rarity_name || type_name || printing_name || set_v2_name
            }).join('/')
        }).join(', ')
    }

    return (<>
        {portfolio.inventory.bulkSplits.length > 0
        ?
            <ItemContainer>
                <h3>Bulk</h3>
                {portfolio.inventory.bulkSplits.map(split => {
                    return <div className='bulkSplit'>
                        <p>{compileBulkLabels(split.labels)}</p>
                        <p>{split.bulk_split_estimate ? '~' : ''}{split.bulk_split_count}</p>
                    </div>
                })}
            </ItemContainer>
        :
            <div className='emptyCollection'>
                <p>No items in your collection!</p>
                <p>Update your collection with a purchase.</p>
                <Link to='update/purchase'>
                    <button>Update Collection</button>
                </Link>
            </div>
        }
    </>)
}

export default PortfolioAssets
