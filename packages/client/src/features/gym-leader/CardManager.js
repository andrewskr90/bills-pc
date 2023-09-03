import React from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import PtcgioManager from './PtcgioManager'

const CardManager = () => {

    return (<div className='cardManager'>
        <div className='gymLeaderToolbar'>
            <h2>Card Manager</h2>
            <Link to='ptcgio' className='link'>PTCGIO</Link>
            <Link to='bills-pc' className='link'>Bills PC</Link>
        </div>
        <Routes>
            <Route path='/ptcgio/*' element={<PtcgioManager />} />
        </Routes>
    </div>)
}

export default CardManager
