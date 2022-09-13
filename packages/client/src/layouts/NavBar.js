import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const NavBar = () => {
    const [selected, setSelected] = useState()
    const location = useLocation()

    useEffect(() => {
        if (location.pathname.includes('/collection')) {
            setSelected('collection')
        // if (location.pathname.includes('/rip')) {
        //     setSelected('rip')
        } else if (location.pathname.includes('import')) {
            setSelected('import')
        // } else if (location.pathname.includes('sell')) {
        //     setSelected('sell')
        // } else if (location.pathname.includes('trade')) {
        //     setSelected('trade')
        } else {
            setSelected('marketplace')
        }
    }, [location])

    return (<div className='navBar'>
        <Link 
            to='/' 
            className={`link ${selected === 'marketplace' ? 'selected': ''}`}
        >
            Market
        </Link>
        <Link 
            to='/collection' 
            className={`link ${selected === 'collection' ? 'selected': ''}`}
        >
            PC
        </Link>
        {/* <Link 
            to='/rip' 
            className={`link ${selected === 'rip' ? 'selected': ''}`}
        >
            Rip
        </Link> */}
        <Link 
            to='/import' 
            className={`link ${selected === 'import' ? 'selected': ''}`}
        >
            Buy
        </Link>
        {/* <Link 
            to='/sell' 
            className={`link ${selected === 'sell' ? 'selected': ''}`}
        >
            Sell
        </Link>
        <Link 
            to='/trade' 
            className={`link ${selected === 'trade' ? 'selected': ''}`}
        >
            Trade
        </Link> */}
    </div>)
}

export default NavBar;