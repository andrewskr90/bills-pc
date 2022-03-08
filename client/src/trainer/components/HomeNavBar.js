import React from 'react';
import { useHistory } from 'react-router-dom';

const HomeNavBar = (props) => {
  const { user } = props;
  const history = useHistory();
  const clickBillsPC = () => {
    history.push('/my-collection')
  }

    return (
      <header className='home-nav-bar'>
        <h1
          onClick={clickBillsPC}
        >
          Bill's PC
        </h1>
        <nav>
          {user ? <a href='logout'>Logout</a> : <a href='login'>Login</a>}
        </nav>
      </header>
    )
}

export default HomeNavBar;