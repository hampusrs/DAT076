import React, {useEffect, useState, useRef} from 'react';
import './Login.css';
import axios from 'axios';
import {Dropdown} from 'react-bootstrap';

export function Login() {
    function loginWithSpotify() {
        console.log("Hello!");
        //const response = await axios.get<{ currentPlayers: Player[] }>("http://localhost:8080/login");
    }

    return (
        <div className="Login center">
            <button className="login-button" onClick={loginWithSpotify}>Log in</button>
        </div>
    );
}

export default Login;