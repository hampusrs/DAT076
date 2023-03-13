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
    async function loginWithSpotify() {
        window.location.href = "http://localhost:8080/login";
    }

    return (
        <div className="Login">
                <div className='Label'>Click right to log in</div>
                <button className="login-button" onClick={loginWithSpotify}>Log in</button>
        </div>
    );
}

export default Login;
