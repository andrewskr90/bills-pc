import React from 'react'
import './assets/itemContainer.less'

const ItemContainer = ({ children, loading, emptyMessage }) => {

    return (!loading ? (
            children.length > 0 ? (
                <div className='itemContainer'>
                    {children}
                </div>
            ) : (
                <p className='emptyMessage'>{emptyMessage}</p>
            )
    ) : (
        <p>Loading...</p>
    ))
}

export default ItemContainer
