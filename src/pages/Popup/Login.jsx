import React from 'react';
import logo from '../../assets/img/dframe.png';
// import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';
import { useEffect } from 'react';

const Login = () => {
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      history('/');
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} alt="logo" />
        <h2>Welcome to Dframe</h2>
      </header>
      <a
        href="http://localhost:3001"
        rel="noopener noreferrer"
        className="App-link"
        target="_blank"
        style={{ fontSize: '20px', paddingTop: '55px' }}
      >
        Log in
      </a>
    </div>
  );
};

export default Login;
