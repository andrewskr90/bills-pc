import React, { useEffect } from 'react'
import SearchCards from './components/SearchCards'
import MyCollection from './components/MyCollection'
import axios from 'axios';

function App() {

  useEffect(() => {
    axios.get('https://api.pokemontcg.io/v2/cards?q=name:houndoom')
    .then(res=>{
      console.log(res)
    })
    .catch(err=>console.log(err))
  },[])
  
  return (
    <div>
      <SearchCards />
      <MyCollection />
    </div>
  );
}

export default App;
