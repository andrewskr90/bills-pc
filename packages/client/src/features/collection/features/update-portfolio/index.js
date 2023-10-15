import React from 'react'
import Banner from '../../../../layouts/banner'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import './assets/updatePortfolio.less'
import ImportPurchase from '../../../import-purchase'
import CategorySelector from '../../../../components/category-selector'
import { buildPreviousRoute } from '../../../../utils/location'
import ImportGift from '../../../import-gift'
import SortBulkSplits from './features/sort-bulk-splits'

const updatePortfolioCategories = ['import', 'purchase', 'sort', 'trade', 'sale', 'export']

const UpdatePortfolio = (props) => {
    const { 
        referenceData, 
        setReferenceData,
        portfolio
    } = props
    const navigate = useNavigate()
    const location = useLocation()

    const selectCategory = (category) => {
        navigate(category)
    }

    const handleClickBackArrow = () => {
        navigate(buildPreviousRoute(location, 2))
    }

    return (<div className='updatePortfolio page'>
        <Banner titleText={'Update Portfolio'} handleClickBackArrow={handleClickBackArrow}>
            <CategorySelector 
                categories={updatePortfolioCategories} 
                selectCategory={selectCategory} 
            />
        </Banner>
        <Routes>
            <Route 
                path='/import/*'
                element={<ImportGift referenceData={referenceData} setReferenceData={setReferenceData} />}
            />
            <Route 
                path='/purchase/*'
                element={<ImportPurchase referenceData={referenceData} setReferenceData={setReferenceData} />}
            />
            <Route 
                path='/trade/*'
                element={<>trade componet</>}
            />
            <Route 
                path='/sale/*'
                element={<>sale component</>}
            />
            <Route path="/sort/*" element={<SortBulkSplits portfolio={portfolio} referenceData={referenceData} setReferenceData={setReferenceData} />} />
            <Route 
                path='/export/*'
                element={<>export component</>}
            />
        </Routes>
    </div>)
}

export default UpdatePortfolio
