import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const NewNavBar = () => {
    const [selected, setSelected] = useState()
    const location = useLocation()

    useEffect(() => {
        if (location.pathname.includes('/gym-leader/collection')) {
            setSelected('collection')
        } else if (location.pathname.includes('/market')) {
            setSelected('market')
        } else if (location.pathname.includes('/gym-leader/vendors')) {
            setSelected('vendors')
        }
    }, [location])

    return (<div className='navBar'>
        <Link 
            to='/market' 
            className={`link ${selected === 'market' ? 'selected': ''}`}
        >
            Market
        </Link>
        <Link 
            to='/gym-leader/collection/assets' 
            className={`link ${selected === 'collection' ? 'selected': ''}`}
        >
            Collection
        </Link>
        <Link 
            to='/gym-leader/vendors' 
            className={`link ${selected === 'vendors' ? 'selected': ''}`}
        >
            Vendors
        </Link>
    </div>)
}

export default NewNavBar;