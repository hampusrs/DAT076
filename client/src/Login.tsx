import React, {useEffect, useState, useRef} from 'react';
import './Login.css';
import {accessToken} from './spotify';

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
}

export default Login;
