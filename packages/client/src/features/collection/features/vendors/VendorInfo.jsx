import React from 'react'
import PreviousRoutes from '../../../../layouts/previous-routes'
import { useLocation } from 'react-router-dom'

const VendorInfo = () => {
    const location = useLocation()
    return (<>
        <PreviousRoutes location={location} />
    </>)
}

export default VendorInfo
