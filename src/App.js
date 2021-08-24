import React from 'react'
import Search from './components/Search'
import MyCollection from './components/MyCollection'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'
import './App.css'

function App() {
  
  return (
    <div>
      <p>Pokemon Card App</p>
      <Router>
      <Switch>
      <Route path='/collection'>
        <MyCollection />
      </Route>
      <Route path='/login'>
        <Search />
      </Route>
      <Route path='/'>
        <Search/>
      </Route>
      </Switch>
      </Router>
    </div>
  );
}

export default App;
