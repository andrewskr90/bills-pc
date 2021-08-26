import React, { useState } from 'react'
import Search from './components/Search'
import MyCollection from './components/MyCollection'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'
import './App.css'

function App() {
  const [myCollectionArray, setMyCollectionArray] = useState([])
  
  return (
    <div>
      <header style={{display:'flex'}}>
        <p>Pokemon Card App</p>
        <nav style={{display:'flex', alignItems:'center', padding:'0 5vw 0 5vw'}}>
          <a href='/search'>Search Cards</a>
          <a href='/collection'>Collection</a>
        </nav>
      </header>
      <Router>
      <Switch>
      <Route path='/collection'>
        <MyCollection myCollectionArray={myCollectionArray} />
      </Route>
      <Route path='/search'>
        <Search myCollectionArray={myCollectionArray} setMyCollectionArray={setMyCollectionArray} />
      </Route>
      <Route path='/'>
        <Search myCollectionArray={myCollectionArray} setMyCollectionArray={setMyCollectionArray} />
      </Route>
      </Switch>
      </Router>
    </div>
  );
}

export default App;
