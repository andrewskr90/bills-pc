import React from 'react'
import { Route, Switch } from 'react-router-dom'

import './styles/App.css';
import './styles/GymLeader.css'
import NavBar from './components/trainer/NavBar'
import TrainerRoute from './utils/auth/privateRoutes/TrainerRoute'
import GymLeaderRoute from './utils/auth/privateRoutes/GymLeaderRoute'
import TrainerHome from './components/trainer/TrainerHome'
import Login from './components/common/Login'
import GymLeaderHome from './components/gymLeader/GymLeaderHome'

function App() {

  return (
    <div className='app'>
      <Route path='/' component={NavBar} />
      <TrainerRoute path='/' component={TrainerHome} />
      <Route path='/login' component={Login} />
      <GymLeaderRoute path='/gym-leader' component={GymLeaderHome} />


      {/* <HomeNavBar path='/' />
      <Route path='/gym-leader/login' component={GymLeaderLogin}/>
      <Route path='/gym-leader/home' component={GymLeaderHome}/>
      <PrivateRoute path='/home' component={HomeNavBar} /> */}
    </div>
  );
}

export default App
