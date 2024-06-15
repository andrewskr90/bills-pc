import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { parseSlugAfter } from '../../utils/location'
import './assets/categorySelector.css'

const CategorySelector = (props) => {
    const location = useLocation()
    const { categories, selectCategory, basePage } = props
    const initialSelectedCategory = parseSlugAfter(basePage, location)
    const [selectedCategory, setSelectedCategory] = useState(initialSelectedCategory)

    const handleSelectCategory = (category) => {
        setSelectedCategory(category)
        selectCategory(category)
    }

    return (<div className='categorySelector'>
        {categories.map((category, idx) => {
            let selected = false
            if (category === selectedCategory) selected = true
            return <div key={idx} className={`category ${selected ? 'selected' : ''}`} onClick={() => handleSelectCategory(category)}>{category}</div>
        })}
    </div>)
}

export default CategorySelector
