import React, { useEffect, useState } from 'react'
import PreviousRoutes from '../../layouts/previous-routes'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import BillsPcService from '../../api/bills-pc'
import PageSelection from '../../components/page-selection'
import ItemContainer from '../../components/item-container'
import CollectedItem from '../../components/collected-item'
import { buildParams } from '../../utils/location'

const VendorInfo = ({ managing, setManaging }) => {
    const location = useLocation()
    const urlParams = useParams()
    const navigate = useNavigate()
    const proxyUserId = urlParams['id']
    const [loading, setLoading] = useState(true)
    const [portfolio, setPortfolio] = useState([])
    const [count, setCount] = useState()

    useEffect(() => {
        (async () => {
            const params = { proxy: true, proxyUserId }
            let vendor = managing
            if (!managing) {
                await BillsPcService.getUsers({ params })
                    .then(res => {
                        if (res.data.users.length === 1) {
                            vendor = res.data.users[0]
                            setManaging(res.data.users[0])
                        }
                    }).catch(err => console.log(err))
            }

            if (vendor) {
                const params = buildParams(location)
                params.direction = params.direction ? params.direction : undefined
                params.proxyUserId = proxyUserId
                setLoading(true)
                await BillsPcService.getPortfolio(params)
                    .then(res => {
                        setCount(res.data.count)
                        setPortfolio(res.data.items)
                        setLoading(false)
                    })
                    .catch(err => console.log(err))
            } else {
                navigate('/gym-leader/vendors')
            }
        })()
    }, [location.search])
    
    useEffect(() => {
        return () => {
            setManaging() 
        }
    }, [])
    
    return (<>
        <PreviousRoutes location={location} />
        {portfolio.length === 0 && !loading ?
            <div className='emptyCollection'>
                <p>No items in your collection!</p>
                <p>Update your collection with a purchase.</p>
                <Link to='import'>
                    <button>Update Collection</button>
                </Link>
            </div> :
            <>
                <PageSelection location={location} count={count} />
                <ItemContainer emptyMessage={'Query yielded no items'} loading={loading} >
                    {portfolio.map(collectedItem => <CollectedItem collectedItem={collectedItem} handleSelectItem={(id) => handleSelectAsset(`collected-item/${id}`)} />)}
                    <PageSelection location={location} count={count} />
                </ItemContainer>
            </>}
    </>)
}

export default VendorInfo
