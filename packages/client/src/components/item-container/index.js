import React from 'react'
import './assets/itemContainer.less'

const ItemContainer = ({ children, loading, emptyMessage }) => {

    return (!loading ? (
            children.length > 0 ? (
                <div className='itemContainer'>
                    {children}
                </div>
            ) : (
                <p>{emptyMessage}</p>
            )
    ) : (
        <p>Loading...</p>
    ))
}

export default ItemContainer
