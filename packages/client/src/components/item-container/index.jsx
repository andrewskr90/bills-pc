import React from 'react'
import './assets/itemContainer.css'

const ItemContainer = ({ children, loading, emptyMessage }) => {

    return (!loading ? (
            children.length > 0 ? (
                <div className='itemContainer'>
                    {children}
                </div>
            ) : (
                <div className='itemContainer'>
                    <p className='emptyMessage'>{emptyMessage}</p>
                </div>
            )
    ) : (
        <p>Loading...</p>
    ))
}

export default ItemContainer
