import React, { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Vendors from './Vendors'
import VendorInfo from './VendorInfo'
import Header from '../../layouts/header'

const VendorManager = ({ referenceData, setReferenceData }) => {
    const [managing, setManaging] = useState()

    return <div className='flex flex-col items-center'>
        <Header main title={'Vendors'}>
            {managing && <>
                <p className='text-right'>Managing: {managing.user_name}</p>
            </>}
        </Header>
        <Routes>
            <Route 
                path='/'
                element={<Vendors 
                    referenceData={referenceData}
                    setReferenceData={setReferenceData}
                />}
            />
            <Route 
                path='/:id/*'
                element={<VendorInfo 
                    managing={managing} 
                    setManaging={setManaging} 
                    referenceData={referenceData}
                    setReferenceData={setReferenceData}
                />}
            />
        </Routes>
    </div>
}

export default VendorManager
