import React from 'react';
import { useHistory } from 'react-router-dom';

const HomeNavBar = () => {
  const history = useHistory();
  const clickBillsPC = () => {
    history.push('/my-collection')

    
    }
    return (
        <header class='home-nav-bar'>
          <h1
            onClick={clickBillsPC}
          >
            Bill's PC
          </h1>
          <nav>
            <a>Add Item</a>
            <a>Settings</a>
          </nav>
        </header>
    )
}

export default HomeNavBar;