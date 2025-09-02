import React, { useEffect, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { buildParams } from '../../utils/location'
import BillsPcService from '../../api/bills-pc'
import Toolbar from '../../layouts/toolbar'
import PageSelection from '../../components/page-selection'
import ItemContainer from '../../components/item-container'
import Button from '../../components/buttons/text-button'
import CreateVendor from './CreateVendor'

const Vendors = (props) => {
        const {
        referenceData,
        setReferenceData
    } = props
    const navigate = useNavigate()
    const location = useLocation()
    const [vendors, setVendors] = useState([])
    const [vendorCount, setVendorCount] = useState()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        (async () => {
            const params = buildParams(location)
            params.proxy = true
            await BillsPcService.getUsers({ params })
                .then(res => {
                    setVendorCount(res.data.count)
                    setVendors(res.data.users)
                    setLoading(false)
                })
                .catch(err => console.log(err))
        })()
    }, [location.search])
    
    const handleViewVendor = (id, navigate) => {
        navigate(id)
    }
    const sortKey = 'vendorSort'
    return (
        !loading ? (
            vendors.length > 0 ? (<Routes>
                <Route
                    path='/'
                    element={<>
                        <Toolbar
                            sortKey={sortKey}
                            referenceData={referenceData}
                            setReferenceData={setReferenceData}
                            defaultSortDirection='asc'
                            defaultAttribute='name'
                        />
                        <Button onClick={() => navigate('create')}>Create Vendor</Button>
                        <PageSelection location={location} count={vendorCount} />
                        <ItemContainer emptyMessage={'Query yielded no vendors'} loading={loading} >
                            {vendors.map(vendor => <div className='flex justify-between items-center shadow-md rounded-sm mt-3 p-1'>
                                <div className='flex flex-col'>
                                    <p className='my-0'>{vendor.user_name}</p>
                                </div>
                                <button onClick={() => handleViewVendor(vendor.user_id, navigate)}>View</button>
                            </div>)}
                        </ItemContainer>
                    </>}
                />
                <Route 
                    path='/create'
                    element={<CreateVendor />}
                />
            </Routes>) : (<>
                <p>You aren't tracking any vendors, create a vendor to begin managing their inventory.</p>
            </>)
        ) : <>...loading</>
    )
}

export default Vendors