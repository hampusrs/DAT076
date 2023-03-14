import React, {useEffect, useState} from 'react';
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
    function loginWithSpotify() {
        window.location.href = "http://localhost:8080/login";
    }

    return (
        <div className="Login">
                <div className='Label'>Welcome!</div>
                <button className="login-button" onClick={loginWithSpotify}>Log in w/ Spotify</button>
        </div>
    );
}

export default Login;
