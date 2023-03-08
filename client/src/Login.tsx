import React, {useEffect, useState, useRef} from 'react';
import './Login.css';
import axios from 'axios';
import {Dropdown} from 'react-bootstrap';

export function Login() {
    async function loginWithSpotify() {
        //console.log("Hello!");
        //const response = await axios.get<{ redirectUri: string }>("http://localhost:8080/login");
        //const { redirectUri } = response.data;
        window.location.href = "http://localhost:8080/login";
    }

    return (
        <div className="Login center">
            <button className="login-button" onClick={loginWithSpotify}>Log in</button>
        </div>
    );
}

export default Login;