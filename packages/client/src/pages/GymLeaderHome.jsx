import React, { useState, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import CardManager from '../features/gym-leader/CardManager.jsx'
import '../styles/GymLeader.less'

const GymLeaderHome = () => {

    return (
        <div className='gymLeaderHome'>
            <header className='header'>
                <h1>Gym Leader Admin</h1>
                <div className='navBar'>
                    <Link className='link' to='card-manager'>Card Manager</Link>
                    <Link className='link' to='trainer-manager'>Trainer Manager</Link>
                    <Link className='link' to='/'>Trainer Site</Link>
                    <Link className='link' to='/logout'>Logout</Link>
                </div>
            </header>
            <Routes>
                <Route path='/card-manager/*' element={<CardManager />} />
            </Routes>
        </div>
    )
}

export default GymLeaderHome
