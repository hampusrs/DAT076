import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {PreGame} from './PreGame';
import {exec} from "child_process";
import axios, {AxiosStatic} from 'axios';

/** Create the mocked version of Axios */
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<AxiosStatic>

enum Page {
    PREGAME,
    PLAYGAME,
}

//const [page, setPage] = useState<Page>(Page.PREGAME);

let page: Page = Page.PREGAME;

function renderPreGame() {
    render(<PreGame goToGamePage={() => {
        //setPage(Page.PLAYGAME);
        page = Page.PLAYGAME
    }}/>);
}

describe('PreGame', () => {
    //TODO: Make async so that State can be used
    test('renders Start Game button', () => {
        renderPreGame();

        const startGameButton = screen.getByRole('button', {name: /Start Game/});
        expect(startGameButton).toBeInTheDocument();
    });


    test('makes a request to /game/started every second', async () => {
        renderPreGame();

        setTimeout(() => {
            expect(mockedAxios.get).toHaveBeenCalledWith("http://localhost:8080/game/started");
        }, 1000);
    });

});

describe('Start Game button', () => {
    test('calls "goToGamePage" prop when clicked', async () => {
        renderPreGame();

        const startGameButton = screen.getByRole('button', {name: /Start Game/});
        expect(startGameButton).toBeInTheDocument();

        fireEvent.click(startGameButton);
        expect(page).toEqual(Page.PLAYGAME);
    });


    //TODO
    test('makes a start game request only once', () => {
        //expect(0).toEqual(1);
    });
});

