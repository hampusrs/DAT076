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

describe('App', () => {
    test('renders login page as default', () => {
        render(<App/>);

        const loginButton = screen.getByText(/Log in/);
        expect(loginButton).toBeInTheDocument();

    });

});
