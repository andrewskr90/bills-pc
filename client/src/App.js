import React, { useState } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import './styles/App.css';
import './styles/GymLeader.css'
import PrivateRoute from './trainer/components/PrivateRoute'
import HomeNavBar from './trainer/components/HomeNavBar'
import GymLeaderLogin from './GymLeader/components/GymLeaderLogin'
import GymLeaderHome from './GymLeader/components/GymLeaderHome'

function App() {
  const [user, setUser] = useState(false)

  return (
    <>
      <Router>
        <HomeNavBar path='/' user={user} />
        <Route path='/gym-leader/login' component={GymLeaderLogin}/>
        <Route path='/gym-leader/home' component={GymLeaderHome}/>
        <PrivateRoute path='/home' component={HomeNavBar} user={user} />
      </Router>
    </>
  );
}

export default App
