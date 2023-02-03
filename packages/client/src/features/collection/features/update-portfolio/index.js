import React from 'react'
import Banner from '../../../../layouts/banner'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import './assets/updatePortfolio.less'
import ImportPurchase from '../../../import-purchase'
import CategorySelector from '../../../../components/category-selector'
import { buildPreviousRoute } from '../../../../utils/location'

const updatePortfolioCategories = ['import', 'purchase', 'trade', 'sale', 'export']

const UpdatePortfolio = (props) => {
    const { 
        referenceData, 
        setReferenceData
    } = props
    const navigate = useNavigate()
    const location = useLocation()

    const selectCategory = (category) => {
        navigate(category)
    }

    const handleClickBackArrow = () => {
        navigate(buildPreviousRoute(location))
    }

    return (<div className='updatePortfolio page'>
        <Banner titleText={'Update Portfolio'} handleClickBackArrow={handleClickBackArrow}>
            <CategorySelector categories={updatePortfolioCategories} selectCategory={selectCategory} />
        </Banner>
        <Routes>
            <Route 
                path='/import/*'
                element={<>import component</>}
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
            <Route 
                path='/export/*'
                element={<>export component</>}
            />
        </Routes>
    </div>)
}

export default UpdatePortfolio
