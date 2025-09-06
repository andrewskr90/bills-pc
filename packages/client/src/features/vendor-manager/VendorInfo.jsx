import React, { useEffect, useState } from 'react'
import { Route, Routes, useNavigate, useParams } from 'react-router-dom'
import BillsPcService from '../../api/bills-pc'
import SelectItems from '../../components/select-items'
import { formatDateToInput } from '../../utils/date'
import VendorPortfolio from './VendorPortfolio'

const VendorInfo = ({ managing, setManaging, referenceData, setReferenceData }) => {
    const urlParams = useParams()
    const navigate = useNavigate()
    const proxyUserId = urlParams['id']
    const [importTime, setImportTime] = useState(formatDateToInput(new Date()))

    const handleSelectItems = async (items) => {
        const data = { 
            time: new Date(importTime).toISOString(), 
            importerId: proxyUserId,
            items 
        }
        await BillsPcService.createImports({ data })
            .then(res => {
                navigate(`/gym-leader/vendors/${proxyUserId}`)
            })
            .catch(err => {
                console.log(err)
            })

    }
    
    useEffect(() => {
        return () => {
            setManaging() 
        }
    }, [])
    
    return (<Routes>
        <Route 
            path='/' 
            element={<VendorPortfolio managing={managing} setManaging={setManaging}/>} 
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
