import React from "react"
import { Link, Route, Routes } from "react-router-dom"
import ItemContainer from "../../../../components/item-container/index.jsx"
import CollectedItem from "../../../../components/collected-item/index.jsx"
// import BulkSplitInfo from "../../BulkSplitInfo.jsx"
// import BulkSplit from "../../BulkSplit.jsx"
const PortfolioAssets = (props) => {
    const { portfolio } = props 
    // const navigate = useNavigate()
    
    // const selectBulkSplit = (splitId) => {
    //     navigate(`bulk/${splitId}`)
    // }
    return (<>
        {portfolio.length
        ?   
            <Routes>
                <Route 
                    path="/"
                    element={<ItemContainer>
                        {/* <h3>Bulk</h3>
                        {portfolio.inventory.bulkSplits.map(split => {
                            return <BulkSplit selectBulkSplit={selectBulkSplit} bulkSplit={split}/>
                        })} */}
                        {portfolio.map(collectedItem => <CollectedItem collectedItem={collectedItem} handleSelectItem={() => console.log(collectedItem)} />)}
                    </ItemContainer>}
                />
                {/* <Route 
                    path={`/bulk/:bulkSplitId`}
                    element={<BulkSplitInfo portfolio={portfolio} userClaims={userClaims} />}
                /> */}
            </Routes>
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
