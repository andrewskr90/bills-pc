import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const NavBar = () => {
    const [selected, setSelected] = useState()
    const location = useLocation()

    useEffect(() => {
        if (location.pathname.includes('/collection')) {
            setSelected('collection')
        } else if (location.pathname.includes('/market')) {
            setSelected('market')
        } else if (location.pathname.includes('/register')) {
            setSelected('register')
        } else if (location.pathname.includes('/support-us')) {
            setSelected('support-us')
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
            to='/collection' 
            className={`link ${selected === 'collection' ? 'selected': ''}`}
        >
            Collection
        </Link>
    </div>)
}

export default NavBar;