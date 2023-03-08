import React, {useEffect, useState, useRef} from 'react';
import './Login.css';
import App from "./currentPlayers";
import {accessToken} from './spotify';
import {Routes, Route, Link} from 'react-router-dom';

export function Login() {
    const [token, setToken] = useState<string>('');

    useEffect(() => {
        setToken(accessToken);
    }, []);

    async function loginWithSpotify() {
        window.location.href = "http://localhost:8080/login";
    }

    if (token == '') {
        return (
            <div className="Login center">
                <header className="App-header">
                    <button className="login-button" onClick={loginWithSpotify}>Log in</button>
                </header>
            </div>
        );
    } else {
        return (
            <App/>
        );
    }

    /**
     return (
     <div className="Login center">
     <header className="App-header">
     {!token ? (
                    <button className="login-button" onClick={loginWithSpotify}>Log in</button>
                ) : (
                    <h1>Logged in!</h1>
                )}
     </header>
     </div>
     );
     */
}

export default Login;
