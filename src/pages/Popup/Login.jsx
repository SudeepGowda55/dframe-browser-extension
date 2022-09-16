import React from 'react';
import logo from '../../assets/img/dframe.png';
// import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';

const Login = () => {
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} alt="logo" />
                <h2>
                    Welcome to Dframe
                </h2>
            </header>
            <a href="https://d-frame-user-dashboard.vercel.app/" rel="noopener noreferrer" className="App-link" target="_blank" style={{ fontSize: "20px", paddingTop: "55px" }}>
                Log in
            </a>
        </div>
    );
};

export default Login;
