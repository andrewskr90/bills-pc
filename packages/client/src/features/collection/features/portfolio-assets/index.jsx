import React from "react"
import { Route, Routes } from "react-router-dom"
import AssetItemInfo from "./AssetItemInfo.jsx"
import CollectedItemInfo from "./CollectedItemInfo.jsx"
import LotInfo from "./LotInfo.jsx"
import Assets from "./Assets.jsx"
// import BulkSplitInfo from "../../BulkSplitInfo.jsx"
// import BulkSplit from "../../BulkSplit.jsx"
const PortfolioAssets = (props) => {
    const { 
        referenceData, 
        setReferenceData 
    } = props 
    
    // const selectBulkSplit = (splitId) => {
    //     navigate(`bulk/${splitId}`)
    // }

    
    return (<>
        <Routes>
            <Route 
                path="/"
                element={<Assets referenceData={referenceData} setReferenceData={setReferenceData} />}
            />
            {/* <Route 
                path={`/bulk/:bulkSplitId`}
                element={<BulkSplitInfo portfolio={portfolio} userClaims={userClaims} />}
            /> */}
            <Route 
                path="/item/:itemId"
                element={<AssetItemInfo />}
            />
            <Route 
                path="/collected-item/:id/*"
                element={<CollectedItemInfo />}
            />
            <Route 
                path="/lot/:id/*"
                element={<LotInfo />}
            />
        </Routes>
    </>)
}

export default PortfolioAssets
