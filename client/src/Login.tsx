import React, {useEffect, useState, useRef} from 'react';
import './Login.css';
//import PreGame from "./PreGame";
import {accessToken} from './spotify';
import {Routes, Route, Link} from 'react-router-dom';

export function Login(props: {
    goToPreGamePage: () => void
}) {
    const [token, setToken] = useState<string>('');

    useEffect(() => {
        setToken(accessToken);
    }, []);

    if (!(token == '')) {
        props.goToPreGamePage();
    }

    async function loginWithSpotify() {
        window.location.href = "http://localhost:8080/login";
    }

    return (
        <div className="Login center">
            <header className="App-header">
                <button className="login-button" onClick={loginWithSpotify}>Log in</button>
            </header>
        </div>
    );

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
