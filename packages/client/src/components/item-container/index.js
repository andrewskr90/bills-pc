import React from 'react'
import './assets/itemContainer.less'

const ItemContainer = ({ children }) => {

    return (<div className='itemContainer'>
        {children}
    </div>)
}

export default ItemContainer
