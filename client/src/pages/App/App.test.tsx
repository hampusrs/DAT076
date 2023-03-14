import React from 'react';
import {useState} from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import App from './App';
import PreGame from "../PreGame/PreGame";
//import {SongItem} from './components/SongItem';
import axios, {AxiosStatic} from 'axios';

/** Create the mocked version of Axios */
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<AxiosStatic>

test('Check that app renders login button', () => {
    render(<App/>);

    const loginButton = screen.getByText(/Log in/);
    expect(loginButton).toBeInTheDocument();

    //TODO: Check that when the button is clicked, the user is redirected to http://localhost:8080/login
    //fireEvent.click(loginButton);

    //expect(window.location.href).toEqual('http://localhost:8080/login');
    //expect(mockedAxios.get).toHaveBeenCalledWith("http://localhost:8080/login");
});