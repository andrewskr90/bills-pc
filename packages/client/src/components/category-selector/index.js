import React, { useState } from 'react'
import './assets/categorySelector.less'

const CategorySelector = (props) => {
    const { categories, selectCategory } = props
    const [selectedCategory, setSelectedCategory] = useState(categories[0])

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
