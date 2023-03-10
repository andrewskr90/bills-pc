import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { parseLastRouteParameter } from '../../utils/location'
import './assets/categorySelector.less'

const CategorySelector = (props) => {
    const location = useLocation()
    const { categories, selectCategory } = props
    const initialSelectedCategory = parseLastRouteParameter(location)
    const [selectedCategory, setSelectedCategory] = useState(initialSelectedCategory)

    const handleSelectCategory = (category) => {
        setSelectedCategory(category)
        selectCategory(category)
    }

    return (<div className='categorySelector'>
        {categories.map(category => {
            let selected = false
            if (category === selectedCategory) selected = true
            return <div className={`category ${selected ? 'selected' : ''}`} onClick={() => handleSelectCategory(category)}>{category}</div>
        })}
    </div>)
}

export default CategorySelector
