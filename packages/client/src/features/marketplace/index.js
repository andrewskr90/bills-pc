import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Routes, Route } from 'react-router-dom'
import BillsPcService from '../../api/bills-pc'
import ExpansionsMarketplace from './ExpansionsMarketplace'
import ExpansionItemsMarketplace from './ExpansionItemsMarketplace'
import './assets/marketplace.less'

const Marketplace = (props) => {
    const { referenceData, setReferenceData } = props
    const [showFilterModal, setShowFilterModal] = useState(false)

    const openFilterModal = () => {
        setShowFilterModal(true)
    }

    return (<div className='marketplace'>
        <Routes>
            <Route 
                path='/'
                element={<ExpansionsMarketplace
                    referenceData={referenceData}
                    setReferenceData={setReferenceData}
                />}
            />
            <Route 
                path='/:setId' 
                element={<ExpansionItemsMarketplace 
                    referenceData={referenceData} 
                    setReferenceData={setReferenceData}
                    openFilterModal={openFilterModal} 
                    showFilterModal={showFilterModal} 
                    setShowFilterModal={setShowFilterModal} 
                />} 
            />
        </Routes>
    </div>)
}

export default Marketplace
