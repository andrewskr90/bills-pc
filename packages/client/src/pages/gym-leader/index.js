import React from 'react'
import Banner from '../../layouts/banner'
import CategorySelector from '../../components/category-selector'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { buildPreviousRoute } from '../../utils/location'
import TypeTools from './features/type-tools'
import RarityTools from './features/rarity-tools'
import PrintingTools from './features/printing-tools'

const gymLeaderNavCategories = ['types', 'rarities', 'printings']

const GymLeader = (props) => {
    const navigate = useNavigate()
    const location = useLocation()

    const handleClickBackArrow = () => {
        navigate(buildPreviousRoute(location, 2))
    }

    const selectCategory = (category) => {
        navigate(category)
    }

    return (<div className='gymLeader'>
        <Banner titleText={'Gym Leader'} handleClickBackArrow={handleClickBackArrow}>
            <CategorySelector
                categories={gymLeaderNavCategories} 
                selectCategory={selectCategory} 
            />
        </Banner>
        <Routes>
            <Route
                path='/types/*'
                element={<TypeTools />}
            />
            <Route
                path='/rarities/*'
                element={<RarityTools />}
            />
            <Route
                path='/printings/*'
                element={<PrintingTools />}
            />
        </Routes>
    </div>)
}

export default GymLeader
