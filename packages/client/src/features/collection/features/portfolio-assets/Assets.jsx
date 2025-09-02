import React, { useEffect, useState } from 'react'
import Search from '../../../search';
import Toolbar from '../../../../layouts/toolbar';
import PageSelection from '../../../../components/page-selection';
import ItemContainer from '../../../../components/item-container';
import CollectedItem from '../../../../components/collected-item';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { buildParams } from '../../../../utils/location';
import BillsPcService from '../../../../api/bills-pc';

const Assets = (props) => {
    const { referenceData, setReferenceData} = props
    const navigate = useNavigate()
    const location = useLocation()
    const [loading, setLoading] = useState(true)
    const [portfolio, setPortfolio] = useState([])
    const [count, setCount] = useState()
    useEffect(() => {
        (async () => {
            const params = buildParams(location)
            params.direction = params.direction ? params.direction : undefined
            setLoading(true)
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
    return <>
        <Search setLoading={setLoading} />
        <Toolbar
            sortKey={sortKey}
            referenceData={referenceData}
            setReferenceData={setReferenceData}
            defaultSortDirection='asc'
            defaultAttribute='name'
        />
        {portfolio.length === 0 && !loading ?
            <div className='emptyCollection'>
                <p>No items in your collection!</p>
                <p>Update your collection with a purchase.</p>
                <Link to='update/purchase'>
                    <button>Update Collection</button>
                </Link>
            </div> :
            <>
                <PageSelection location={location} count={count} />
                <ItemContainer emptyMessage={'Query yielded no items'} loading={loading} >
                    {/* <h3>Bulk</h3>
                    {portfolio.inventory.bulkSplits.map(split => {
                        return <BulkSplit selectBulkSplit={selectBulkSplit} bulkSplit={split}/>
                    })} */}
                    {portfolio.map(collectedItem => <CollectedItem collectedItem={collectedItem} handleSelectItem={(id) => handleSelectAsset(`collected-item/${id}`)} />)}
                    <PageSelection location={location} count={count} />
                </ItemContainer>
            </>}
    </>
}

export default Assets;
