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

//TODO: Make async so that State can be used
test('Check that pregame renders startgame button', async () => {
    enum Page {
        PREGAME,
        PLAYGAME,
    }

    //const [page, setPage] = useState<Page>(Page.PREGAME);

    let page: Page = Page.PREGAME;

    render(<PreGame goToGamePage={() => {
        //setPage(Page.PLAYGAME);
        page = Page.PLAYGAME
    }}/>);

    const startGameButton = screen.getByText(/Start Game/);
    expect(startGameButton).toBeInTheDocument();

    fireEvent.click(startGameButton);


    expect(page).toEqual(Page.PLAYGAME);

});


/*
test('Check that song is rendered', () => {
    render(<SongItem title="FireWorks" artist="Katy Perry" album="Teenage Dream"
                     albumCoverURI="./logo.svg"></SongItem>);
    expect(screen.getByText(/Katy Perry/)).toBeInTheDocument();
    expect(screen.getByText(/Teenage Dream/)).toBeInTheDocument();
});

test('Check that the start game request is only sent once', () => {

});
*/

// How to test next song?