import React, { useEffect, useState } from 'react'
import BillsPcService from '../../api/bills-pc'
import PreviousRoutes from '../../layouts/previous-routes'
import PlusButton from '../../components/buttons/plus-button'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import PageSelection from '../../components/page-selection'
import ItemContainer from '../../components/item-container'
import CollectedItem from '../../components/collected-item'
import { buildQueryParams } from '../../utils/location'

const VendorPortfolio = ({ managing, setManaging }) => {
        const urlParams = useParams()
        const location = useLocation()
        const queryParams = buildQueryParams(location)
        const proxyUserId = urlParams['id']
        const [portfolio, setPortfolio] = useState([])
        const [loading, setLoading] = useState(true)
        const [count, setCount] = useState()
        const navigate = useNavigate()

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
                    setLoading(true)
                    await BillsPcService.getPortfolio({ ...queryParams, proxyUserId })
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
        }, [queryParams.page])

        return <>
            <PreviousRoutes location={location} />
            <div className='flex justify-center items-center w-full my-3'>
                <p className='mr-2'>Import Items</p>
                <PlusButton handleClick={() => navigate('import')} />
            </div>
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
                        {portfolio.map(collectedItem => <CollectedItem collectedItem={collectedItem} handleSelectItem={(id) => navigate(`collected-item/${id}`)} />)}
                        <PageSelection location={location} count={count} />
                    </ItemContainer>
                </>}
        </>
    }

    export default VendorPortfolio
