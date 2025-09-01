import React, { useEffect, useState } from 'react'
import PreviousRoutes from '../../layouts/previous-routes'
import { Link, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import BillsPcService from '../../api/bills-pc'
import PageSelection from '../../components/page-selection'
import ItemContainer from '../../components/item-container'
import CollectedItem from '../../components/collected-item'
import { buildParams } from '../../utils/location'
import SelectItems from '../../components/select-items'
import PlusButton from '../../components/buttons/plus-button'
import { formatDateToInput } from '../../utils/date'

const VendorInfo = ({ managing, setManaging, referenceData, setReferenceData }) => {
    const location = useLocation()
    const urlParams = useParams()
    const navigate = useNavigate()
    const proxyUserId = urlParams['id']
    const [loading, setLoading] = useState(true)
    const [portfolio, setPortfolio] = useState([])
    const [count, setCount] = useState()
    const [importTime, setImportTime] = useState(formatDateToInput(new Date()))

    const handleSelectItems = async (items) => {
        const data = { 
            time: new Date(importTime).toISOString(), 
            items 
        }
        console.log(data)
        // await BillsPcService.createImports({ data })
        //     .then(res => {
        //         console.log(res)
        //         navigate(`/gym-leader/vendors/${proxyUserId}`)
        //     })
        //     .catch(err => {
        //         console.log(err)
        //     })

    }

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
    
    return (<Routes>
        <Route 
            path='/' 
            element={<>
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
                            {portfolio.map(collectedItem => <CollectedItem collectedItem={collectedItem} handleSelectItem={(id) => handleSelectAsset(`collected-item/${id}`)} />)}
                            <PageSelection location={location} count={count} />
                        </ItemContainer>
                    </>}
            </>} 
        />
        <Route 
            path='/import/*'
            element={<SelectItems
                referenceData={referenceData}
                setReferenceData={setReferenceData}
                handleSelectItems={handleSelectItems}
                initialEmptyMessage={"Search for items to import."}
                actionTitle='Import Items'
                importTime={importTime}
                setImportTime={setImportTime}
            />}
        />
    </Routes>
    )
}

export default VendorInfo
