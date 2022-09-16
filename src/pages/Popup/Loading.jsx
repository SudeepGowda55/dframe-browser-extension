import React from "react";
import logo from '../../assets/img/dframe.png';

export default function Loading() {
    return (
        <div className="container">
            <p>Welcome To</p>
            <img src={logo} width="120" alt="logo" />
            <p>Decentralized Data Ecosystem</p>
        </div>
    );
}