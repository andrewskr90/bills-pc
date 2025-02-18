import React, { useEffect, useState } from "react"
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom"
import ItemContainer from "../../../../components/item-container/index.jsx"
import CollectedItem from "../../../../components/collected-item/index.jsx"
import BillsPcService from "../../../../api/bills-pc/index.js"
import PageSelection from "../../../../components/page-selection/index.jsx"
import { buildParams } from "../../../../utils/location/index.js"
import Toolbar from "../../../../layouts/toolbar/index.jsx"
import Search from "../../../search/index.jsx"
import AssetItemInfo from "./AssetItemInfo.jsx"
import CollectedItemInfo from "./CollectedItemInfo.jsx"
import LotInfo from "./LotInfo.jsx"
// import BulkSplitInfo from "../../BulkSplitInfo.jsx"
// import BulkSplit from "../../BulkSplit.jsx"
const PortfolioAssets = (props) => {
    const { 
        portfolio, 
        setPortfolio, 
        count, 
        setCount, 
        referenceData, 
        setReferenceData 
    } = props 
    const navigate = useNavigate()
    const location = useLocation()
    const [loading, setLoading] = useState(false)
    
    // const selectBulkSplit = (splitId) => {
    //     navigate(`bulk/${splitId}`)
    // }

    useEffect(() => {
        (async () => {
            const params = buildParams(location)
            params.direction = params.direction ? params.direction : undefined
            await BillsPcService.getPortfolio(params)
            .then(res => {
                setCount(res.data.count)
                setPortfolio(res.data.items)
                setLoading(false)
            })
            .catch(err => console.log(err))
        })()
    }, [location.search])
    const sortKey = 'portfolioItemSort'

    const handleSelectAsset = (slug) => {
        navigate(slug)
    }
    return (<>
        {portfolio.length
        ?   
            <Routes>
                <Route 
                    path="/"
                    element={<>
                        <Search setLoading={setLoading} />
                        <Toolbar
                            sortKey={sortKey}
                            referenceData={referenceData}
                            setReferenceData={setReferenceData}
                            defaultSortDirection='asc'
                            defaultAttribute='name'
                        />
                        <PageSelection location={location} count={count} />
                        <ItemContainer emptyMessage={'Query yielded no items'} loading={loading} >
                            {/* <h3>Bulk</h3>
                            {portfolio.inventory.bulkSplits.map(split => {
                                return <BulkSplit selectBulkSplit={selectBulkSplit} bulkSplit={split}/>
                            })} */}
                            {portfolio.map(collectedItem => <CollectedItem collectedItem={collectedItem} handleSelectItem={(id) => handleSelectAsset(`item/${id}`)} />)}
                            <PageSelection location={location} count={count} />
                        </ItemContainer>
                    </>}
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
