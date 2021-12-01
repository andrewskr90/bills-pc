import React, { useState } from 'react'
import Search from './components/Search'
import MyCollection from './components/MyCollection'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'
import './App.css'
import RipForm from './components/RipForm'
import PurchaseForm from './components/PurchaseForm'
import SearchedCardPage from './components/SearchedCardPage'

function App() {
  const [myCollectionArray, setMyCollectionArray] = useState([])
  
  return (
    <>
      <div>
      <header>Bill's PC</header>
      {/* <header style={{display:'flex'}}>
        <p>Pokemon Card App</p>
        <nav style={{display:'flex', alignItems:'center', padding:'0 5vw 0 5vw'}}>
          <a href='/search'>Search Cards</a>
          <a href='/collection'>Collection</a>
        </nav>
      </header> */}
      {/* <RipForm/> */}
      {/* <PurchaseForm /> */}
      {/* <Router>
      <Switch> */}
      {/* <Route path='/searchCard'>
        <SearchedCardPage/>
      </Route>
      <Route path='/collection'>
        <MyCollection myCollectionArray={myCollectionArray} />
      </Route>
      <Route path='/search'>
        <Search myCollectionArray={myCollectionArray} setMyCollectionArray={setMyCollectionArray} />
      </Route>
      <Route path='/'>
        <Search myCollectionArray={myCollectionArray} setMyCollectionArray={setMyCollectionArray} />
      </Route> */}
      {/* </Switch>
      </Router> */}
    </div>
    </>
  );
}

export default App;
