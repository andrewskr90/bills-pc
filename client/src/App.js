import React, { useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import PrivateRoute from './components/PrivateRoute';
import AdminLogin from './components/AdminLogin';
import HomeNavBar from './components/HomeNavBar';

import './App.css';

function App() {
  const [user, setUser] = useState(false);

  return (
    <>
      <Router>
        <HomeNavBar path='/' user={user} />
        <Route path='/gym-leader' component={AdminLogin}/>
        <PrivateRoute path='/home' component={HomeNavBar} user={user} />
      </Router>
    </>
  );
}

export default App;
